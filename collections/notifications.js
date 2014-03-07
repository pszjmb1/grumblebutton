Notifications = new Meteor.Collection('notifications');

createCommentNotification = function(comment) {
	var issue = Issues.findOne(comment.issueId);
	if(issue.userId)
	{		
		if (comment.userId !== issue.userId) {
			Notifications.insert({
			userId: issue.userId,
			issueId: issue._id,
			commentId: comment._id,
			commenterName: comment.author,
			read: false
		});	
		}
	}
	console.log('for subscribed users');
	var subUsers = issue.subscribedUsers;
	if(subUsers)
	{		
		console.log('inside if');
		//var person = Issues.findOne({issueId:issue._id}).subscribedUsers;
		//console.log(person.length);
		
		var i;
		for(i=0;i<subUsers.length;i++)
		{
			if(comment.userId !== subUsers[0].username)
			{
				console.log('entering values in notification Collection');
				Notifications.insert({
				userId: subUsers[0]._id,
				issueId: issue._id,
				commentId: comment._id,
				commenterName: comment.author,
				read: false
				});
			}
		}
	}	
};

