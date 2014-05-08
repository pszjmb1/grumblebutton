/**
 * Template helper for closedIssues
 */

// issueClosed field denotes the closed status of issues
// Set value of closedIssueSearch field denotes that user wants to search this issue
var global='';
Template.closedIssues.helpers({
	closedIssues: function() {
		// Returning closed issues 
		return Issues.find({issueClosed:1, closedIssueSearch:0});
	},
	findSeachedIssues: function() {

		return Issues.find({issueClosed:1, closedIssueSearch:1}).count();		
		
	},
	searchedIssues: function() {
		//alert('inside searchedIssues');
		//alert('session value searchedIssues'+global);
		return Issues.find({issueClosed:1, closedIssueSearch:1}); //, {sort: {submitted: -1}});
	}	
			//limit: issuesHandle.limit()
});
	/*},
	// Determine if curent list of issues is ready
	issuesReady: function() {
		return !issuesHandle.loading();
	},
	// Determine if all issues have been loaded
	allIssuesLoaded: function() {
		return !issuesHandle.loading() &&
			Issues.find().count() < issuesHandle.loaded();
	}
});

// Handle the load more event
Template.issues.events({
	'click .load-more': function(e) {
		e.preventDefault();
		issuesHandle.loadNextPage();
	}
});*/

// Unsetting the closedIssueSearch field to be use in next search
Template.closedIssues.events({
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
				Issues.update(myDoc._id, {$set: {closedIssueSearch: 0}});
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
		var regEx='', unit='', dept='', shortdesc='', room='';

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
					unit = myDoc.unit;
					//alert('unit '+unit);
					dept = myDoc.dept;
					//alert('dept '+dept);
					shortdesc = myDoc.shortdesc;
					//alert('shortdesc '+shortdesc);
					room = myDoc.room;
					//alert('room '+room);
					if(shortdesc.match(regEx) || dept.match(regEx) || unit.match(regEx)|| room.match(regEx))
					{
					
						//alert('value matches with any of the field');
						Issues.update(myDoc._id, {$set: {closedIssueSearch: 1}});
						//alert('IssueSearch value '+Issues.findOne({_id:myDoc._id}).closedIssueSearch);
					}
				//alert('one loop completed');
				});
			}

		}
		return false;
	}
});

