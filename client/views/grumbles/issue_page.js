/**
 * Helpers for rendering Issue detail pages.
 */
var global='';
Template.issuePage.helpers({
	currentIssue: function() {
		return Issues.findOne(Session.get('currentIssueId'));
	},
	comments: function() {
		return Comments.find({issueId: this._id});
	},
	findSeachedComments: function() {
		// Returning the comments which user wants to search
		return Comments.find({ commentSearch:1}).count();		
		
	},
	searchedComments: function() {
		return Comments.find({commentSearch:1}); //, {sort: {submitted: -1}});
	}
});

// Unsetting the commentSearch field to be used in next search
Template.issuePage.events({
	'click #textbox': function(e) {
		jQuery('#textbox').on('input', function() {
		comments = Comments.find();
		if(comments)
		{
			comments.forEach(function (myDoc)
			{
				Meteor.call('toggleCommentSearch', myDoc._id, 0, function(error) {
					if(error){
						throwError(error.reason || "Unknown error resetting search field");
					}
				});
			});
		}
				
		});
	},
	// Setting the commentSearch field to select the required comment from collection
	'click #search': function(e) {
		global = document.querySelector('[name=keyword]').value;
		Session.set("key",global);
		var comments = Comments.find();
		var regEx='', body='';
		// Showing error message when user clicked the search button without entering keyword to find
		if(!Session.get("key"))
		{
			alert('Enter element to search');
		}
		else
		{
			// Able to search every format of keyword entered
			regEx = new RegExp("^.*"+Session.get("key")+".*","gi");
			if(comments)
			{
				comments.forEach( function(myDoc)
				{
					body = myDoc.body;
					if(body.match(regEx))
					{
						Meteor.call('toggleCommentSearch', myDoc._id, 1, function(error) {
							if(error){
								throwError(error.reason || "Unknown error setting search field");
							}
						});
					}
				});
			}	
		}
		return false;
	}
});

