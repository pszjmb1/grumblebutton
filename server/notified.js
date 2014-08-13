Meteor.methods({
  user: function(personName, personEmailId, senderEmail, id, subjectOfEmail, personId, shortdesc) {
   console.log('inside user function');
	console.log('personName '+personName);
   Meteor.users.find().forEach( function(myUsers) 
   {
	console.log('myUsers.username '+myUsers.username);
	if(myUsers.username === personName && !myUsers.notified)
	{
		console.log('value updated in users field');
		var messageToSubscribedUsers = "Hello "+personName+",\n\n"+ "The new issue has been raised - " +shortdesc+
    						". The link for the concerned issue is :- http://localhost:15000/issues/";

		// Notification to all subscribed Users
		console.log('mail to subscribed users in rest of the form part');
		Meteor.call('sendEmail',
        	personEmailId,  
			senderEmail,
	        messageToSubscribedUsers,
			id,
			subjectOfEmail); 
		console.log('notification to subscribed users in rest of the form');
		Notifications.insert({
			userId: personId, // users id who has posted the issue
			issueId: id,   // issue id
			//commentId: comment._id,
			//commenterName: comment.author,
			postedUserId:Meteor.user() ,
			postedUserName: Meteor.user().username,
			read: false,
			timestamp: new Date()
		});	
		Meteor.users.update(myUsers._id, {$set: {notified : 1}});
		return true;

	}
   });
  }

});

Meteor.methods({

  setDefaultValue: function(){
  	console.log('notified value is unset again');
    Meteor.users.find().forEach( function(myUsers) 
      {
	 Meteor.users.update(myUsers._id, {$set: {notified : 0}});	

      });
  }
});



