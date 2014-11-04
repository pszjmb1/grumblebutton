/**
 * Template helpers for a closed issue
 */
//milliseconds to day
var millisInDay=1000*60*60*24;

Template.closedIssue.helpers({
	notAnon: function(author){
		if(author != 'anonymous')
			return true;
		else return false
	},
	'whenSubmitted': function(){
		var issueDate = Issues.findOne(this._id).date;
		var issueTime = Issues.findOne(this._id).time;
		return getDaysSince(issueDate, issueTime);
	}
});

Template.closedIssue.events({
	'click #press': function () {
		// Updating the issueClosed field to 0 while reopening the issue
		Meteor.call('toggleIssueClosed', this._id, 0, function(error) {
			if(error){
				throwError(error.reason || "Unknown error opening issue");
			}
		});
		var issueUserId = Issues.findOne(this._id).userId;
		var id = this._id;
		var senderEmail = 'grumblebutton@gmail.com';
		var details = Issues.findOne(this._id).details;
		var shortdesc = Issues.findOne(this._id).shortdesc;
		var location = Issues.findOne(this._id).location;
		var subjectOfEmail = "Opening of Issue";
		var person='', regEx='';
	
	    // Mail to user who has posted the issue regarding it's opening
		var userMessage = "Hello,\n\n"+   
        	". The following issue has been opened - "+shortdesc +".\n\n"+
        	"The link for the concerned issue is :- http://localhost:15000/closedIssues/";
        
		Meteor.call('sendEmail',
           	issueUserId,
		    senderEmail,
		    userMessage,
		    id,
		    subjectOfEmail, function(error) {
				if(error){
					throwError(error.reason || "Unknown error sending email");
				}
			}
		); 

        Meteor.call('createOpenNotification', issueUserId, id, function(error) {
			if(error){
				throwError(error.reason || "Unknown error creating notification");
			}
		});

		// Mail to users who have subscribed to this issue
		/*if(Issues.findOne(this._id).subscribedUsers)
		{
			var subscribedPerson = Issues.findOne(this._id).subscribedUsers;
			if(subscribedPerson && subscribedPerson.length)
			{
				for(i=0;i<subscribedPerson.length;i++)
				{
					var subscribedUserMessage = "Hello "+subscribedPerson[i].profile.addressing+",\n\n"+
						". The following issue has been opened - "+shortdesc +".\n\n"+
						"The link for the concerned issue is :- http://localhost:15000/closedIssues/";
					Meteor.call('sendEmail',
    	   	    	   	subscribedPerson[i],
			            senderEmail,
		    	        subscribedUserMessage,
			    	    this._id,
						subjectOfEmail, function(error) {
							if(error){
								throwError(error.reason || "Unknown error sending email");
							}
						}
					); 

					Meteor.call('createOpenNotification', subscribedPerson[i], this._id, function(error) {
						if(error){
							throwError(error.reason || "Unknown error creating notification");
						}
					});
				}
			}
		}*/

		// Mail to user who has subscribed to domain but not to this issue
		var listOfDomain = Subscribed.find();
		listOfDomain.forEach( function(myDoc) 
		{
			// Creating regular expression to check all possible format in which user can enter domain name
			regEx = new RegExp("^.*"+myDoc.category+".*","gi"); 
			// Checking whether domain name is present in the details part of the form
			if(details.match(regEx) || location.match(regEx))
			{										
				// Users who have subscribed to that domain, from Subscribed collection
		 		person = myDoc.categorySubscribedUsers;
				if(person && person.length)
				{
					for(j=0;j<person.length;j++)
					{
						var subscribedUserMessage = "Hello,\n\n"+
							". The following issue has been opened - "+shortdesc +".\n\n"+
							"The link for the concerned issue is :- http://localhost:15000/closedIssues/";

						// Notification to all subscribed Users of that domain
						Meteor.call('sendEmail',
							person[j],
							senderEmail,
							subscribedUserMessage,
							id,
							subjectOfEmail, function(error) {
								if(error){
									throwError(error.reason || "Unknown error sending email");
								}
							}
						); 
						
						Meteor.call('createOpenNotification', person[j], id, function(error) {
							if(error){
								throwError(error.reason || "Unknown error creating notification");
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
		// Making the found field to be 0 for to be use next time
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