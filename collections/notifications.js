Notifications = new Meteor.Collection('notifications');

createCommentNotification = function(comment) {

	// Notification to user who has raised the issue
	var issue = Issues.findOne(comment.issueId);
	if(issue.userId)
	{		console.log('notification sent to user who has posted the issue');
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

	//Notification to all subscribed users
	var subUsers = issue.subscribedUsers;
	if(subUsers)
	{		
		console.log('inside if');
		//var person = Issues.findOne({issueId:issue._id}).subscribedUsers;
		//console.log(person.length);
		var i;
		for(i=0;i<subUsers.length;i++)
		{
			if(comment.author !== subUsers[0].username)
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

	// Notification to manager
	console.log('notification to mgr');
	var fromEmail = 'grumblebutton@gmail.com';
    var userId = Meteor.user();
    console.log('userId '+ userId._id);

    var userName = userId.username;
    console.log('userName '+userName);
    //var managerName = Managers.findOne({category:category});
	//var toEmail = Managers.findOne({category:category});  ** HARDCODED **
	//var issueRaisedUser = Issues.findOne(this._id).postedUser;
	var a = Issues.findOne({_id:issue._id});
	var issueManagerCategory = a.category;
	var managerEmailId = Managers.findOne({category: issueManagerCategory}).emailId;
	var managerName = Managers.findOne({category: issueManagerCategory}).name;

    var managerMsg = "Hello "+ managerName +",\n\n"+
    	userName + ' has commented on the issue belonging to your category having issueId:- ';
	var subject = 'Notification of comment on Issue';
/*	Meteor.call('sendEmail',
        	    	managerEmailId,
			        fromEmail,
			        managerMsg,
				    this._id,
				    subject);	 */
};

