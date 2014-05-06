/**
 * Helpers for rendering Issue detail pages.
 */

Template.issuePage.helpers({
	currentIssue: function() {
		//alert('inside issuePage');
		return Issues.findOne(Session.get('currentIssueId'));
	},
	comments: function() {
		return Comments.find({issueId: this._id});
	},
	findSeachedComments: function() {
		// Returning the comments which user wants to search
		var count = Comments.find({ commentSearch:1}).count();		
		return count;
	},
	searchedComments: function() {
		//alert('inside searchedIssues');
		return Comments.find({commentSearch:1}); //, {sort: {submitted: -1}});
	}
});

// Unsetting the commentSearch field to be used in next search
Template.issuePage.events({
	'click #textbox': function(e) {
		//alert('value is inside but changed');
		jQuery('#textbox').on('input', function() {
		comments = Comments.find();
		if(comments)
		{
			comments.forEach(function (myDoc)
			{
				//alert('set issueSearch -> 0');
				Comments.update(myDoc._id, {$set: {commentSearch: 0}});
			});
		}
				
		});
	}
});

// Setting the commentSearch field to select the required comment from collection
Template.issuePage.events({
	'click #search': function(e) {
		//alert('search textbox');
		var key = document.querySelector('[name=keyword]').value;
		var comments = Comments.find();
		var regEx='', body='';
		// Showing error message when user clicked the search button without entering keyword to find
		if(!key)
		{
			alert('Enter element to search');
		}
		if(key)
		{
			//alert('value is inside but not changed');
			// Able to search every format of keyword entered
			regEx = new RegExp("^.*"+key+".*","gi");
			//alert('key '+key);
			if(comments)
			{
				comments.forEach( function(myDoc)
				{
					body = myDoc.body;
					//alert('myDoc.body '+body);
					if(body.match(regEx))
					{
						
						//alert('value matches with body of the comment');
						Comments.update(myDoc._id, {$set: {commentSearch: 1}});
						//alert(Comments.findOne({_id:myDoc._id}).commentSearch);
					}
				//alert('one loop completed');
				});
			}	
		}

	}
});

