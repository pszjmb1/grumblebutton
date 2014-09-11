/**
 * Template helper for closedIssues
 */

// issueClosed field denotes the closed status of issues
// Set value of closedIssueSearch field denotes that user wants to search this issue
var global='';
Template.closedIssues.helpers({
	closedIssues: function() {
		// Returning closed issues 
		return Issues.find({issueClosed:1}, {sort: {submitted: -1}, 
			limit: closedIssuesHandle.limit()});
	},
	findSeachedIssues: function() {
		return Issues.find({issueClosed:1, closedIssueSearch:1}).count();		
		
	},
	searchedIssues: function() {
		return Issues.find({issueClosed:1, closedIssueSearch:1}, {sort: {submitted: -1}});
	},
	// Determine if curent list of issues is ready
	issuesReady: function() {
		return !closedIssuesHandle.loading();
	},
	// Determine if all issues have been loaded
	allIssuesLoaded: function() {
		return !closedIssuesHandle.loading() &&
			Issues.find({issueClosed: 1}).count() < closedIssuesHandle.loaded();
	}
});

// Unsetting the closedIssueSearch field to be use in next search
Template.closedIssues.events({
	// Handle the load more event
	'click .load-more': function(e) 
	{
		e.preventDefault();
		closedIssuesHandle.loadNextPage();
	},
	'click #textbox': function(e) 
	{
		jQuery('#textbox').on('input', function() 
		{
			issues = Issues.find();
			if(issues)
			{
				issues.forEach(function (myDoc)
				{
					Meteor.call('toggleClosedSearch', myDoc._id, 0);
				});
			}		
		});
	}
});

// Updating the closedIssueSearch field to retrieve onlye the required one closed issues
Template.closedIssues.events({
	'click #search': function(e) {
		e.preventDefault();
		global = document.querySelector('[name=keyword]').value;
		//Session.set("key",document.querySelector('[name=keyword]').value );
		Session.set("key", global);
		var issues = Issues.find({issueClosed:1});
		var regEx='', location='', details='';

		// Preventing the user to search without entering the search keyword
		if(!Session.get("key"))
		{
			alert('Enter element to search');
		}
		if(Session.get("key"))
		{
			regEx = new RegExp("^.*"+Session.get("key")+".*","gi");
			if(issues)
			{
				issues.forEach( function(myDoc)
				{
					location = myDoc.location || "";
					details = myDoc.details || myDoc.shortdesc;
					if(details.match(regEx) || location.match(regEx))
					{
						Meteor.call('toggleClosedSearch', myDoc._id, 1);
					}
				});
			}

		}
		return false;
	}
});

