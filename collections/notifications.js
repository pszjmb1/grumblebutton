/**
* Add notification to Notification collection
*/

Notifications = new Meteor.Collection('notifications');

Meteor.methods({
	createOpenNotification : function(userId, issueId) {
		if(Meteor.isServer)
		{
			var user = Meteor.users.findOne({_id : userId});
			if(!user.notified)
			{
				Notifications.insert({
					userId: userId, // users id who has posted the issue
					issueId: issueId,   // issue id
					openerId:Meteor.userId() ,
					openerName: Meteor.user().profile.addressing,
					read: false,
					timestamp: new Date()
				});
				Meteor.users.update({_id: userId}, {$set : {notified: 1}});
			}
			return;
		}
		else return;
	},

	createPostNotification : function(issueId, authorName, author) {
		Notifications.insert({
			userId: Meteor.userId(), // users id who has posted the issue
			issueId: issueId, // issue id
			postedUserId: Meteor.userId() ,
			postedUserName: (author == 'anonymous' ? author : authorName),
			read: false,
			timestamp: new Date()
		});	 
	},

	createCloseNotification : function(userId, issueId) {
		if(Meteor.isServer)
		{
			var user = Meteor.users.findOne(userId);
			if(!user.notified)
			{
				Notifications.insert({
					userId: userId, // users id who has posted the issue
					issueId: issueId,   // issue id
					closerId:Meteor.userId() ,
					closerName: Meteor.user().profile.addressing,
					read: false,
					timestamp: new Date()
				});
				Meteor.users.update({_id: userId}, {$set : {notified: 1}});
			}
			return;
		}
		else return;
	},

	setReadNotification : function(id) {
		Notifications.update(id, {$set: {read: true}});
	},

	createCommentNotification : function(comment) {
		// Id  of the issue which has been commented out
		var issue = Issues.findOne(comment.issueId);
		var senderEmail = 'grumblebutton@gmail.com';
		var subjectOfEmail = 'Notification about comment';
		var userMessage = "Hello "+ issue.postedUser +",\n\n"+
			comment.author + ' has commented on your issue having issueId:- ';
	    var flag =0;
	    
	    // Notification and Mail to user who has posted the issue
		if (comment.userId !== issue.userId) {
			Notifications.insert({
			userId: issue.userId,
			issueId: comment.issueId,
			commentId: comment.userId,
			commenterName: comment.author,
			read: false,
			timestamp: new Date()
		});
		Meteor.call('sendEmail',
			issue.userId,
			senderEmail,
			userMessage,
			issue,
			subjectOfEmail, 
			function(error) {
				if(error){
					throwError(error.reason || "Unknown error sending email");
				}
			});
		}
		
		/*// Notification to subscribed users of this issue not to the domain related to issue
		var subUsers = issue.subscribedUsers;
		if(subUsers)
		{		
			var i;
			for(i=0;i<subUsers.length;i++)
			{
				if(comment.userId !== subUsers[i])
				{
					Notifications.insert({
					userId: subUsers[i],
					issueId: comment.issueId,
					commentId: comment.userId,
					commenterName: comment.author,
					read: false,
					timestamp: new Date()
					});

					var subscribedUserMessage = "Hello,\n\n"+
	    				comment.author + ' has commented on your subscribed issue having issueId:- ';

					Meteor.call('sendEmail',
		        	   	subUsers[i],
					    senderEmail,
					    subscribedUserMessage,
						issue,
						subjectOfEmail)
				}
			}
		}*/

		var senderEmail = 'grumblebutton@gmail.com';
	    var userId = Meteor.userId();
	    var userName = Meteor.user().profile.addressing;
		var subjectOfEmail = 'Notification of comment on Issue';
		var listOfDomain = Subscribed.find();
		var details = issue.details;
		var location = issue.location;
		var shortdesc = issue.shortdesc;

		// Variable to retrieve the value of done field
		var doneValue=''
		var person='', issuesToBeUnmarked='';

		// Notification to users who have subscribed to the domain related to the issue
		listOfDomain.forEach( function(myDoc) 
		{
			var managerId = myDoc.managerId;
			
	    	var managerMsg = "Hello,\n\n"+
	    		userName + ' has commented on the issue belonging to your category having issueId:- ';

	    	// Creating regular expression to check all possible format in which user can enter domain name
			var regEx = new RegExp("^.*"+myDoc.category+".*","gi"); 

			// Checking whether domain name is present in the details part of the form
			if(details || location)
			{
				if(details.match(regEx) || location.match(regEx))
				{
					// Users who have subscribed to that domain, from Subscribed collection
	 				person = myDoc.categorySubscribedUsers;
					if(person && person.length)
					{
						for(j=0;j<person.length;j++)
						{
							var user = Meteor.users.findOne({_id: person[j]});
							if(!user.notified)
							{
								var subscribedUserMessage = "Hello,\n\n"+
									comment.author + ' has commented on your subscribed issue having issueId:- ';

								// Notification to user who has subscribed this issue domain
								Notifications.insert({
									userId: person[j],
									issueId: comment.issueId,
									commentId: comment.userId,
									commenterName: comment.author,
									read: false,
									timestamp: new Date()
								});

								Meteor.call('sendEmail',
					           		person[j],
								    senderEmail,
								    subscribedUserMessage,
									issue,
									subjectOfEmail, 
									function(error) {
										if(error){
											throwError(error.reason || "Unknown error sending email");
										}
									}
								);
								Meteor.users.update({_id: person[j]}, {$set : {notified: 1}});
							}
						}
					}				
					// Mail to concerned manager
					if(managerId)
					{
						Meteor.call('sendEmail',
							managerId,
							senderEmail,
							managerMsg,
							issue,
							subjectOfEmail, 
							function(error) {
								if(error){
									throwError(error.reason || "Unknown error sending email");
								}
							}
						);
					}
				}
			}
		});
					
		// Unsetting the notified field to be used next time
		Meteor.call('setDefaultValue', function(error) {
			if(error){
				throwError(error.reason || "Unknown error resetting values");
			}
		});
	}
});

