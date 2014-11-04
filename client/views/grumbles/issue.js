/**
 * Template helpers for closing an issue
 */

//Event to close the issue. 
Template.issue.events({
	'click #close': function () {
		// Adding a field to differentiate the closed issue from rest of the issues
	   	Meteor.call('toggleIssueClosed', this._id, 1, function(error) {
			if(error){
				throwError(error.reason || "Unknown error closing issue");
			}
		});
	   	var issueUserId = Issues.findOne(this._id).userId;
		var shortdesc = Issues.findOne(this._id).shortdesc; 
		var details =  Issues.findOne(this._id).details;
		var shortdesc = shortdesc;
		var location =  Issues.findOne(this._id).location;
		var id = this._id;
		var senderEmail = 'grumblebutton@gmail.com';
		var subjectOfEmail = "Closing of Issue";
		var person ='', regEx='';
		
		// Mail to user
	    var userMessage = "Hello,\n\n"+   
	       	". The following issue has been closed - "+shortdesc +".\n\n"+
	       	"The link for the concerned issue is :- http://localhost:15000/closedIssues/";

        Meteor.call('sendEmail',
           	issueUserId,
		    senderEmail,
		    userMessage,
		    id,
			subjectOfEmail, 
			function(error) {
				if(error){
					throwError(error.reason || "Unknown error sending email");
				}
			}); 

        Meteor.call('createCloseNotification', issueUserId, this._id, function(error) {
			if(error){
				throwError(error.reason || "Unknown error creating notifcation");
			}
		});

		// Mail to subscribed users
		/*if(Issues.findOne(this._id).subscribedUsers)
		{
			var subscribedPerson = Issues.findOne(this._id).subscribedUsers;
			if(subscribedPerson.length)
			{
				for(i=0;i<subscribedPerson.length;i++)
				{
					var subscribedUserMessage = "Hello "+subscribedPerson[i].profile.addressing+",\n\n"+
	        			". The following issue has been closed - "+shortdesc +".\n\n"+
	        			"The link for the concerned issue is :- http://localhost:15000/closedIssues/";
	        		//alert('mail to  subscribed user regarding closing of issue');
					Meteor.call('sendEmail',
	       	    	   	subscribedPerson[i]._id,
			            senderEmail,
			            subscribedUserMessage,
				        this._id,
				        subjectOfEmail); 

					Notifications.insert({
						userId: subscribedPerson[i]._id, // users id who has posted the issue
						issueId: this._id,   // issue id
						//commentId: comment._id,
						//commenterName: comment.author,
						closerId:Meteor.userId() ,
						closerName: Meteor.user().profile.addressing || 'anonymous',
						read: false,
						timestamp: new Date()
					});	
				}
			}
		}*/
		
		// Mail to user who has subscribed to domain but of this issue
		var listOfDomain = Subscribed.find();
		listOfDomain.forEach( function(myDoc) 
		{
			// Creating regular expression to check all possible format in which user can enter domain name
			regEx = new RegExp("^.*"+myDoc.category+".*","gi"); 

			// Checking whether domain name is present in the detils part of the form
			if(details.match(regEx) || location.match(regEx))
			{										
				// Users who have subscribed to that domain, from Subscribed collection
 		 		person = myDoc.categorySubscribedUsers;
				if(person && person.length)
				{
					for(j=0;j<person.length;j++)
					{
						var subscribedUserMessage = "Hello,\n\n"+
							". The following issue has been closed - "+shortdesc +".\n\n"+
							"The link for the concerned issue is :- http://localhost:15000/closedIssues/";
											
						// Notification to all subscribed Users of that domain
						Meteor.call('sendEmail',
       			 	   	   	person[j],
        	    	     	senderEmail,
            	  		   	subscribedUserMessage,
				 			id,
				    		subjectOfEmail, 
				    		function(error) {
								if(error){
									throwError(error.reason || "Unknown error sending email");
								}
							}); 

						Meteor.call('createCloseNotification', person[j], id, function(error) {
							if(error){
								throwError(error.reason || "Unknown error creating notifcation");
							}
						});
					}		
					// Adding an extra field in the Subscribed collection so that inspite of having multiple occurences of a domain in the form, multiple time notification to the users can be prevented
					Meteor.call('markUnfound', myDoc._id, function(error) {
						if(error){
							throwError(error.reason || "Unknown error markUnfound");
						}
					});
				}
			}
		});
		listOfDomain.forEach( function(myDoc) 
		{
			Meteor.call('markFound', myDoc._id, function(error) {
				if(error){
					throwError(error.reason || "Unknown error markFound");
				}
			});
		});
		Meteor.call('setDefaultValue', function(error) {
			if(error){
				throwError(error.reason || "Unknown error resetting values");
			}
		});
	}
});

Template.issue.helpers({
	'whenSubmitted': function(){
		var issueDate = Issues.findOne(this._id).date;
		var issueTime = Issues.findOne(this._id).time;
		return getDaysSince(issueDate, issueTime);
	}
});