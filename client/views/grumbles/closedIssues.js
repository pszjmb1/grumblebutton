/**
 * Template helper for closedIssues
 */

Session.setDefault("closed_issues_keyphrase","");

Template.closedIssues.helpers({
	closedIssues: function() {
		// Returning closed issues 
		return Issues.find({issueClosed:1, details: new RegExp(Session.get("closed_issues_keyphrase"))}, {sort: {submitted: -1}, 
			limit: closedIssuesHandle.limit()});
	},
	
	// Determine if curent list of issues is ready
	issuesReady: function() {
		return !closedIssuesHandle.loading();
	},

	// Determine if all issues have been loaded
	allIssuesLoaded: function() {
		return !closedIssuesHandle.loading() &&
			Issues.find({issueClosed: 1}).count() < closedIssuesHandle.loaded();
	},
	keyphrase: function () {
		return Session.get("closed_issues_keyphrase");
	}
});

Template.closedIssues.events({
	// Handle the load more event
	'click .load-more': function(e) {
		e.preventDefault();
		closedIssuesHandle.loadNextPage();
	}
});

// Setting the closed_issues_keyphrases from the close_search_textbox on submit
Template.closedIssues.events({
	'click #search': function(e) {
		e.preventDefault();
		var keyphrase = $('#close_search_textbox').val();
		Session.set("closed_issues_keyphrase", keyphrase);
	}
});
