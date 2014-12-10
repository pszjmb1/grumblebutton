Meteor.methods({
	user: function(senderEmail, id, subjectOfEmail, personId, shortdesc, author) {
		var myUsers = Meteor.users.findOne({_id: personId});
		if(!myUsers.notified)
		{/*
			var messageToSubscribedUsers = "Hello "+myUsers.profile.addressing+",\n\n"+ "A new Sayit.Today issue has been raised: " +shortdesc+
				". \n\nRead more here: http://localhost:15000/issues/.";

			// Notification to all subscribed Users
			Meteor.call('sendEmail',
        personId,
				senderEmail,
	      messageToSubscribedUsers,
				id,
				subjectOfEmail,
				function(error) {
					if(error) throwError(error.reason || "Unknown error sending mail");
				}); */

			Notifications.insert({
				userId: personId, // users id who has posted the issue
				issueId: id,   // issue id
				postedUserId:Meteor.userId() ,
				postedUserName: author,
				read: false,
				timestamp: new Date()
			});	
			Meteor.users.update(myUsers._id, {$set: {notified : 1}});
			return true;
		}
	},

	setDefaultValue: function(){
		Meteor.users.find().forEach( function(myUsers) 
		{
			Meteor.users.update(myUsers._id, {$set: {notified : 0}});	
		});
	}
});



