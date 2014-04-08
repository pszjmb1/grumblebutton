Notifications = new Meteor.Collection('notifications');

createCommentNotification = function(comment) {

	// Notification to user who has raised the issue
	var issue = Issues.findOne(comment.issueId);
/*	if(issue.userId)
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

	//Notification to all subscribed users
	var subUsers = issue.subscribedUsers;
	if(subUsers)
	{		
		//var person = Issues.findOne({issueId:issue._id}).subscribedUsers;
		//console.log(person.length);
		var i;
		for(i=0;i<subUsers.length;i++)
		{
			console.log('subuser '+i+'->'+subUsers[i].username);
			if(comment.author !== subUsers[i].username)
			{
				console.log('entering values in notification Collection');
				Notifications.insert({
				userId: subUsers[i]._id,
				issueId: issue._id,
				commentId: comment._id,
				commenterName: comment.author,
				read: false
				});
			}
		}

	}

	// Notification to manager
	var fromEmail = 'grumblebutton@gmail.com';
    var userId = Meteor.user();
    var userName = userId.username;
	//var toEmail = Subscribed.findOne({category:category});  ** HARDCODED **
	var a = Issues.findOne({_id:issue._id});
	var issueManagerCategory = a.category;
	var managerEmailId = Subscribed.findOne({category: issueManagerCategory}).emailId;
	var managerName = Subscribed.findOne({category: issueManagerCategory}).name;

    var managerMsg = "Hello "+ managerName +",\n\n"+
    	userName + ' has commented on the issue belonging to your category having issueId:- ';
	var subject = 'Notification of comment on Issue';
	Meteor.call('sendEmail',
        	    	managerEmailId,
			        fromEmail,
			        managerMsg,
				    issue._id,
				    subject);	 

*/
	// Notification to users who have subscribed to that domain
	var mgr = Subscribed.find();
	var det = issue.details;
	var shortdesc = issue.shortdesc;
	var detres='', shortdescres='';
	var ch='';
	var flag=0;
	console.log('***Notification to subscribed users***');
	mgr.forEach( function(myDoc) {
		console.log('myDoc '+myDoc._id);
		var id= myDoc._id;
		console.log('*******checking the category in detres******');
		if(det)
		{
			detres = det.split(" ");
	 		for (var i=0; i < detres.length; i++)
			{

				if(detres[i] ===myDoc.category) 
				{	
					// find the value of that field of Subscribed collection
					//var visited = myDoc.done;
		//			console.log('matching  category found in detail part');
					var doneValue=Subscribed.findOne({_id:id}).done;
					if(doneValue === false)
					{
					
						Subscribed.update(myDoc._id, {$set: {done: true}});
		//				console.log('detres -> if -> if ->Subscribed update '+myDoc.designation);
		//				console.log('detres -> if -> if ->Subscribed update '+myDoc.done);
						var person = myDoc.categorySubscribedUsers;
						if(person && person.length)
						{
							for(j=0;j<person.length;j++)
							{
				
		//						console.log('person.username '+j+' '+person[j].username);
								Notifications.insert({
								userId: person[j]._id,
								issueId: issue._id,
								commentId: comment._id,
								commenterName: comment.author,
								read: false
								});
							}
						}
					}
				}
			}
		}

		//console.log('*******category checked in detres part*********');
		//console.log('*******checking the category in shortdescres part******');
		if(shortdesc)
		{
			shortdescres = shortdesc.split(" ");
			for (var i=0; i < shortdescres.length; i++)
			{
				if(shortdescres[i] ===myDoc.category)
				{
					//var visited = myDoc.done;
		//			console.log('matching  category found in shortdesc part');
					var doneValue=Subscribed.findOne({_id:id}).done;
					if(doneValue === false)
					{
						// add value of field to true
					
						Subscribed.update(myDoc._id, {$set: {done: true}});
		//				console.log('shortdesc -> if -> if ->Subscribed update '+myDoc.designation);
		//				console.log('shortdescres -> if -> if ->Subscribed update '+myDoc.done);					
						var person = myDoc.categorySubscribedUsers;
						if(person && person.length)
						{
							for(j=0;j<person.length;j++)
							{
		//						console.log('person '+j+' '+person[j].username);						
								Notifications.insert({
								userId: person[j]._id,
								issueId: issue._id,
								commentId: comment._id,
								commenterName: comment.author,
								read: false
								});
							}
						}
					}
				}
			}
		}
		//console.log('*******category checked in shortdescres part*******');
		//console.log('******before rest of the form******');

		//var visited = myDoc.done;
		var doneValue=Subscribed.findOne({_id:id}).done;
	 	if((issue.category === myDoc.category || issue.unit === myDoc.category || issue.dept === myDoc.category) && doneValue === false)
		{

		//	console.log('matching  category found in rest of the form part');
			Subscribed.update({category: myDoc.category}, {$set: {done: true}});
		//	console.log('rest of the form part -> if -> if ->Subscribed update '+myDoc.designation);											
		//	console.log('rest of the form -> if -> Subscribed update -> visited '+ myDoc.done);						
			var i;
			var person = myDoc.categorySubscribedUsers;
			
			for(i=0;i<person.length;i++)
			{
				// Notification
				Notifications.insert({
				userId: person[i]._id,
				issueId: issue._id,
				commentId: comment._id,
				commenterName: comment.author,
				read: false
				});
			}
		}
		//console.log('******category checked in rest of the form part******');
	});

};

