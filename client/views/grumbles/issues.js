/**
 * Template helper for issues
 */

// issueClosed field denotes the closed status of issues
// Set value of IssueSearch field denotes that user wants to search this issue
var global='';
Template.issues.helpers({
	issues: function() {
		return  Issues.find({issueClosed:0}, {sort: {date: -1, time:-1}, 
			limit: openIssuesHandle.limit()});
	},
	// Determine if curent list of issues is ready
	issuesReady: function() {
		return !openIssuesHandle.loading();
	},
	// Retrieve the count of issues that has been searched
	findSeachedIssues: function() {
		return Issues.find({issueClosed:0, issueSearch:1}).count();		
	},
	// Retrieve the issues that has been searched
	searchedIssues: function() {
		return Issues.find({issueClosed:0, issueSearch:1}, {sort: {date: -1, time:-1}});
	},
	// Determine if all issues have been loaded
	allIssuesLoaded: function() {
		return !openIssuesHandle.loading() &&
			Issues.find({issueClosed: 0}).count() < openIssuesHandle.loaded();
	}
}); 

// Handle the load more event
Template.issues.events({
	'click .load-more': function(e) {
		e.preventDefault();
		openIssuesHandle.loadNextPage();
	}
});

// Unsetting the issueSearch field to be use in next search
Template.issues.events(
{
	'click #textbox': function(e) 
	{
		jQuery('#textbox').on('input', function() 
		{
			issues = Issues.find();
			if(issues)
			{
				issues.forEach(function (myDoc)
				{
					Meteor.call('toggleOpenSearch', myDoc._id, 0, function(error) {
						if(error){
							throwError(error.reason || "Unknown error toggleSearch");
						}
					});
				});
			}	
		});
	}
});

// Setting the issueSearch field to be use to return only required issues
Template.issues.events({
	'click #search': function(e) {
		global = document.querySelector('[name=keyword]').value;
		Session.set("key", global);
		var issues = Issues.find();
		var regEx='', location='', details='';

		//Preventing the user to search without entering the keyword
		if(!Session.get("key"))
		{
			alert('Enter element to search');
		}
		if(Session.get("key"))
		{
			regEx = new RegExp("^.*"+Session.get("key")+".*","gi");
			issues.forEach( function(myDoc)
			{
				location = myDoc.location;
				details = myDoc.details;
				
				// Checking in every part of the form where the search keyword can be found
				if(location.match(regEx) || details.match(regEx))
				{
					Meteor.call('toggleOpenSearch', myDoc._id, 1, function(error) {
						if(error){
							throwError(error.reason || "Unknown error toggleSearch");
						}
					});
				}
			});
		}
		return false;
	}
});

