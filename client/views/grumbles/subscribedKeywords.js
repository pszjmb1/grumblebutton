/**
 * Template helper for SubscribedKeywords
 */

Template.subscribedKeywords.helpers({
	subscribedKeywords: function() {
		//alert('inside subscribedKeywords');
		return Managers.find();
			//limit: issuesHandle.limit()});
	}
	/*,
	
	// Determine if curent list of issues is ready
	issuesReady: function() {
		return !issuesHandle.loading();
	},
	// Determine if all issues have been loaded
	allIssuesLoaded: function() {
		return !issuesHandle.loading() &&
			Issues.find().count() < issuesHandle.loaded();
	}*/
});

// Handle the load more event
/*
Template.issues.events({
	'click .load-more': function(e) {
		e.preventDefault();
		issuesHandle.loadNextPage();
	} */