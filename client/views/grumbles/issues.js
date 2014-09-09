/**
 * Template helper for issues
 */

// issueClosed field denotes the closed status of issues
// Set value of IssueSearch field denotes that user wants to search this issue
var global='';
Template.issues.helpers({
	issues: function() {
		//alert('returning the value');
		return  Issues.find({issueClosed:0}, {sort: {submitted: -1}, 
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
		//alert('inside searchedIssues');
		//alert('session value in searchedIssues'+global);
		return Issues.find({issueClosed:0, issueSearch:1}, {sort: {submitted: -1}});
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
Template.issues.events({
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
				Meteor.call('toggleOpenSearch', myDoc._id, 0);
				//alert(Issues.findOne({_id:myDoc._id}).issueSearch);
			});
		}	
	});
	}
});

// Setting the issueSearch field to be use to return only required issues
Template.issues.events({
	'click #search': function(e) {
		//alert('search textbox');
		global = document.querySelector('[name=keyword]').value;
		//Session.set("key",document.querySelector('[name=keyword]').value );
		Session.set("key", global);
		//alert('sesion value '+ Session.get("key"));
		var issues = Issues.find();
		var regEx='', ward='', department='', shortdesc='', details='';

		//Preventing the user to search without entering the keyword
		if(!Session.get("key"))
		{
			alert('Enter element to search');
		}
		if(Session.get("key"))
		{
			//alert('value is inside but not changed');
			regEx = new RegExp("^.*"+Session.get("key")+".*","gi");
			//alert('key '+key);
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
				//alert('details '+details);
				
				// Checking in every part of the form where the search keyword can be found
				if(shortdesc.match(regEx) || department.match(regEx) || ward.match(regEx) || details.match(regEx))
				{
					
					//alert('value matches with any of the field');
					Meteor.call('toggleOpenSearch', myDoc._id, 1);
					//alert(Issues.findOne({_id:myDoc._id}).issueSearch);
				}
			//alert('one loop completed');
			});

		}
	return false;
	}
});

