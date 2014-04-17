/**
* Add notification to Notification collection
*/

Notifications = new Meteor.Collection('notifications');

createCommentNotification = function(comment) {

	
	// Id  of the issue which has been commented out
	var issue = Issues.findOne(comment.issueId);
	var senderEmail = 'grumblebutton@gmail.com';
	var subjectOfEmail = 'Notification about comment';
	var userMessage = "Hello "+ issue.author +",\n\n"+
    		comment.author + ' has commented on your issue having issueId:- ';
    
	if(issue.userId)
	{
		// Notification to user who has raised the issue		
		if (comment.userId !== issue.userId) {
			Notifications.insert({
			userId: issue.userId,
			issueId: issue._id,
			commentId: comment._id,
			commenterName: comment.author,
			read: false
		});	

		Meteor.call('sendEmail',
        	   	issue.authorEmailId,
			    senderEmail,
			    userMessage,
				issue._id,
				subjectOfEmail)

		}
	}

	// Users who have subscribed to this particular issue
	var subUsers = issue.subscribedUsers;
	if(subUsers)
	{		
	
		//console.log(person.length);
		var i;
		for(i=0;i<subUsers.length;i++)
		{
			//	console.log('subuser '+i+'->'+subUsers[i].username);
			// Notification to all the users who have subscribed to this particular issue
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

				var subscribedUserMessage = "Hello "+ subUsers[i].username +",\n\n"+
    				comment.author + ' has commented on your subscribed issue having issueId:- ';

				Meteor.call('sendEmail',
	        	   	subUsers[i].emails[0].address,
				    senderEmail,
				    subscribedUserMessage,
					issue._id,
					subjectOfEmail)

			}
		}

	}

	// Notification to manager of the domain
	var senderEmail = 'grumblebutton@gmail.com';
    var userId = Meteor.user();
    var userName = userId.username;
	//var toEmail = Subscribed.findOne({category:category});  ** HARDCODED **
	var issueId = Issues.findOne({_id:issue._id});
	var issueManagerCategory = issueId.category;
	var managerEmailId = Subscribed.findOne({category: issueManagerCategory}).emailId;
	var managerName = Subscribed.findOne({category: issueManagerCategory}).name;

    var managerMsg = "Hello "+ managerName +",\n\n"+
    	userName + ' has commented on the issue belonging to your category having issueId:- ';
	var subjectOfEmail = 'Notification of comment on Issue';
	Meteor.call('sendEmail',
        	    	managerEmailId,
			        senderEmail,
			        managerMsg,
				    issue._id,
				    subjectOfEmail);	 


	// Notification to users who have subscribed to the domain which is same as this issue's domain
	var listOfDomain = Subscribed.find();
	var details = issue.details;
	var category = issue.category;
	var dept = issue.dept;
	var unit = issue.unit;
	var shortdesc = issue.shortdesc;
	var doneValue='';
	
	listOfDomain.forEach( function(myDoc) 
	{
					//alert('myDoc._id '+myDoc._id);

					// Creating regular expression to check all possible format in which user can enter domain name
					var regEx = new RegExp("^.*"+myDoc.category+".*","gi"); 

					// Checking whether domain name is present in the detils part of the form
					if(details)
					{
						if(details.match(regEx))
						{										
							//alert('inside details regular expression');

							//doneValue=Subscribed.findOne({_id:issue._id}).done;
							//if(doneValue === false)
							//{
					
								Subscribed.update({category: myDoc.category}, {$set: {done: true}});
								//console.log('detres -> if -> if ->Subscribed update '+myDoc.designation);
								//console.log('detres -> if -> if ->Subscribed update '+myDoc.done);
								// Users who have subscribed to that domain, from Subscribed collection
	 		 					person = myDoc.categorySubscribedUsers;

	 		 					
								//alert('before person loop in details part');
								if(person && person.length)
								{
									for(j=0;j<person.length;j++)
									{
									
										var subscribedUserMessage = "Hello "+ person[j].username +",\n\n"+
    										comment.author + ' has commented on your subscribed issue having issueId:- ';

										Notifications.insert({
											userId: person[j]._id,
											issueId: issue._id,
											commentId: comment._id,
											commenterName: comment.author,
											read: false
										});

										Meteor.call('sendEmail',
							        	   	person[j].emails[0].address,
										    senderEmail,
										    subscribedUserMessage,
											issue._id,
											subjectOfEmail);

									}
								}
							}
							
							//}
					}
				
					// Checking whether keyword is present in shortdesc part of the form
					myDocId = Subscribed.findOne(myDoc._id);							
					doneValue = myDocId.done;
					//alert('value of foundValue '+foundValue);
					if(shortdesc)
					{
						if(!doneValue)
						{
							//	alert('inside shortdesc part');
							Subscribed.update({category: myDoc.category}, {$set: {done: true}});
							if(shortdesc.match(regEx))
							{
								//alert('category matches with shortdesc part');

								// Users who have subscribed to that domain, from Subscribed collection
 			 					person = myDoc.categorySubscribedUsers;
 			 					if(person && person.length)
								{
									//alert('before person loop in shortdesc part');
									for(j=0;j<person.length;j++)
									{

										var subscribedUserMessage = "Hello "+ person[j].username +",\n\n"+
    										comment.author + ' has commented on your subscribed issue having issueId:- ';

										Notifications.insert({
											userId: person[j]._id,
											issueId: issue._id,
											commentId: comment._id,
											commenterName: comment.author,
											read: false
										});

										Meteor.call('sendEmail',
							        	   	person[j].emails[0].address,
										    senderEmail,
										    subscribedUserMessage,
											issue._id,
											subjectOfEmail);

									}
								}
							}
						}								
					}
					myDocId = Subscribed.findOne(myDoc._id);							
					doneValue = myDocId.done;
					// Checking whether keyword is present in rest of the part of the form
					if((category.match(regEx) ||dept.match(regEx) || unit.match(regEx)) && !doneValue)
					{
						// Adding an extra field in the Subscribed collection so that inspite of having multiple occurences of a domain in the form, multiple time notification to the users can be prevented	
						Subscribed.update({category: myDoc.category}, {$set: {done: true}});
						person = myDoc.categorySubscribedUsers;
						if(person && person.length)
						{
							for(j=0;j<person.length;j++)
							{
						
								var subscribedUserMessage = "Hello "+ person[j].username +",\n\n"+
    										comment.author + ' has commented on your subscribed issue having issueId:- ';

								Notifications.insert({
									userId: person[i]._id,
									issueId: issue._id,
									commentId: comment._id,
									commenterName: comment.author,
									read: false
								});
								// Notification to all subscribed Users
								//alert('mail to subscribed users in rest of the form part');

								Meteor.call('sendEmail',
							       	person[j].emails[0].address,
									senderEmail,
									subscribedUserMessage,
									issue._id,
									subjectOfEmail);
							}
						}
					}
						
					
			});
			//console.log('making the done field false for next issue');
			var domainList = Subscribed.find();
			domainList.forEach( function(myDoc) 
			{
				Subscribed.update(myDoc._id, {$set: {done: false}});
				//var determine = Subscribed.findOne(myDoc._id);											
				//console.log('value of found field after rest of the form field part '+determine.done);
			});
	
};

