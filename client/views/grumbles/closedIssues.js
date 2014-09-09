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
		//alert('inside searchedIssues');
		//alert('session value searchedIssues'+global);
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
	'click .load-more': function(e) {
		e.preventDefault();
		closedIssuesHandle.loadNextPage();
	},
	'click #textbox': function(e) {
		//alert('value is inside but changed');
		//alert('global value '+global);
		jQuery('#textbox').on('input', function() {
		//alert('value gets changed');
		issues = Issues.find();
		if(issues)
		{
			issues.forEach(function (myDoc)
			{
				//alert('set issueSearch -> 0');
				Meteor.call('toggleClosedSearch', myDoc._id, 0);
				//alert(Issues.findOne({_id:myDoc._id}).issueSearch);
				});
		}		
		});
	}
});

// Updating the closedIssueSearch field to retrieve onlye the required one closed issues
Template.closedIssues.events({
	'click #search': function(e) {
		//alert('search textbox');
		global = document.querySelector('[name=keyword]').value;
		//Session.set("key",document.querySelector('[name=keyword]').value );
		Session.set("key", global);
		//alert('sesion value '+ Session.get("key"));
		var issues = Issues.find({issueClosed:1});
		var regEx='', ward='', department='', shortdesc='', details='';

		// Preventing the user to search without entering the search keyword
		if(!Session.get("key"))
		{
			alert('Enter element to search');
		}
		if(Session.get("key"))
		{
			//alert('value is inside but not changed');
			regEx = new RegExp("^.*"+Session.get("key")+".*","gi");
			//alert('key '+key);
			if(issues)
			{
				issues.forEach( function(myDoc)
				{
					//alert('inside issues loop');
					ward = myDoc.ward;
					//alert('ward '+ward);
					department = myDoc.department;
					//alert('department '+department);
					shortdesc = myDoc.shortdesc;
					//alert('shortdesc '+shortdesc);
					details = myDoc.details;
					//alert('details '+details)
					if(shortdesc.match(regEx) || department.match(regEx) || ward.match(regEx) || details.match(regEx))
					{
					
						//alert('value matches with any of the field');
						Meteor.call('toggleClosedSearch', myDoc._id, 1);
						//alert('IssueSearch value '+Issues.findOne({_id:myDoc._id}).closedIssueSearch);
					}
				//alert('one loop completed');
				});
			}

		}
		return false;
	}
});

