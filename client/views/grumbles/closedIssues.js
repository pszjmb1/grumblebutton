/**
 * Template helper for closedIssues
 */

Template.closedIssues.helpers({
	closedIssues: function() {
		
		alert('inside closedIssues template -> picking up the issues having issueClosed value as 1');
		return Issues.find({issueClosed:1});
	}	
			//limit: issuesHandle.limit()
});
	//},
	// Determine if curent list of issues is ready
	/*issuesReady: function() {
		return !issuesHandle.loading();
	},
	// Determine if all issues have been loaded
	allIssuesLoaded: function() {
		return !issuesHandle.loading() &&
			Issues.find().count() < issuesHandle.loaded();
	}*/
//});

// Handle the load more event
/*Template.issues.events({
	'click .load-more': function(e) {
		e.preventDefault();
		issuesHandle.loadNextPage();
	}
});*/
