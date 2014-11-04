/**
 * Template helper for issues
 */

Session.setDefault("issues_keyphrase","");
Template.issues.helpers({
	issues: function() {
		return  Issues.find({issueClosed:0, details: new RegExp(Session.get("issues_keyphrase"))}, {sort: {date: -1, time:-1}, 
			limit: openIssuesHandle.limit()});
	},
	// Determine if curent list of issues is ready
	issuesReady: function() {
		return !openIssuesHandle.loading();
	},
	// Determine if all issues have been loaded
	allIssuesLoaded: function() {
		return !openIssuesHandle.loading() &&
			Issues.find({issueClosed: 0}).count() < openIssuesHandle.loaded();
	},
	keyphrase: function () {
		return Session.get("issues_keyphrase");
	}
}); 


// Handle the load more event
Template.issues.events({
	'click .load-more': function(e) {
		e.preventDefault();
		openIssuesHandle.loadNextPage();
	}
});

// Sets the issues_keyphrase session varialble to the contents of the search_textbox
Template.issues.events({
	'click #search': function(e) {
		e.preventDefault();
		var keyphrase = $('#search_textbox').val();
		Session.set("issues_keyphrase", keyphrase);
	}
});

