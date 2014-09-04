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
    var flag =0;
    
    // console.log('Notification to user who has posted the issue');
    // Mail to user who has posted the issue and revealed his identity
	if(issue.author!='anonymous')
	{
		// Notification to user who has raised the issue		
		if (comment.userId !== issue.userId) {
			Notifications.insert({
			userId: issue.userId,
			issueId: comment.issueId,
			commentId: comment._id,
			commenterName: comment.author,
			read: false,
			timestamp: new Date()
		});
		Meteor.call('sendEmail',
        	   	issue.userId,
			    senderEmail,
			    userMessage,
				issue,
				subjectOfEmail)

		}
	}

	// Notification to subscribed users of this issue not to the domain related to issue
    // console.log('Notification to user who has subscribed the issue');
	var subUsers = issue.subscribedUsers;
	if(subUsers)
	{		
	
		//console.log(person.length);
		var i;
		for(i=0;i<subUsers.length;i++)
		{
			// console.log('subuser '+i+'->'+subUsers[i].username);
			if(comment.author !== Meteor.call('getUserName', subUsers[i]._id))
			{
				// console.log('entering values in notification Collection');
				Notifications.insert({
				userId: subUsers[i]._id,
				issueId: issue,
				commentId: comment._id,
				commenterName: comment.author,
				read: false,
				timestamp: new Date()
				});

				var subscribedUserMessage = "Hello "+ Meteor.call('getUserName', subUsers[i]._id) +",\n\n"+
    				comment.author + ' has commented on your subscribed issue having issueId:- ';

				Meteor.call('sendEmail',
	        	   	subUsers[i]._id,
				    senderEmail,
				    subscribedUserMessage,
					issue,
					subjectOfEmail)

			}
		}

	}

	//console.log('Notification to concerned manager');
	var senderEmail = 'grumblebutton@gmail.com';
    var userId = Meteor.userId();
    var userName = Meteor.user().profile.addressing;
	var issueManagerCategory = issue.category;
	var subjectOfEmail = 'Notification of comment on Issue';
	var listOfDomain = Subscribed.find();
	var details = issue.details;
	var category = issue.category;
	var location = issue.location;
	var shortdesc = issue.shortdesc;

	// Variable to retrieve the value of done field
	var doneValue=''
	var person='', issuesToBeUnmarked='';


	// Notification to users who have subscribed to the domain related to the issue
	//console.log('Notification to user who has subscribed the domain but not to this issue');
	listOfDomain.forEach( function(myDoc) 
	{
		//alert('myDoc._id '+myDoc._id);
		var managerId = Subscribed.findOne({category: myDoc.category}).managerId;
		
    	var managerMsg = "Hello,\n\n"+
    		userName + ' has commented on the issue belonging to your category having issueId:- ';

    	// Creating regular expression to check all possible format in which user can enter domain name
		var regEx = new RegExp("^.*"+myDoc.category+".*","gi"); 

		// Checking whether domain name is present in the details part of the form
		if(details)
		{
			if(details.match(regEx))
				{										
							
					//doneValue=Subscribed.findOne({_id:issue._id}).done;
					//if(doneValue === false)
						//{
							//console.log('inside details part of notifcations');

							// Setting the done field about presence of the current user's domain in the current issue
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
									issuesToBeUnmarked = person[j].issuesNotToDisplay;
									//alert('issuesToBeUnmarked.length '+issuesToBeUnmarked.length);
									if(issuesToBeUnmarked && issuesToBeUnmarked.length)
									{
										for(var k=0;k<issuesToBeUnmarked.length;k++)
										{
											if(issuesToBeUnmarked[k] === Issues.findOne(this._id))
											{
												// Setting flag to mark that user does not want this issue to be checked
												flag=1;     
											
												break;
											}
										} 
									}
									// Notification to user who has subscribed this issue domain
									if(flag === 0)
									{
										var subscribedUserMessage = "Hello,\n\n"+
    										comment.author + ' has commented on your subscribed issue having issueId:- ';

										Notifications.insert({
											userId: person[j]._id,
											issueId: issue,
											commentId: comment._id,
											commenterName: comment.author,
											read: false,
											timestamp: new Date()
										});

										Meteor.call('sendEmail',
							           		person[j]._id,
										    senderEmail,
										    subscribedUserMessage,
											issue,
											subjectOfEmail);
										}
										flag =0;
									}	
								}

								// Mail to concerned manager
								Meteor.call('sendEmail',
        	    					managerId,
			        				senderEmail,
			        				managerMsg,
				    				issue,
				    				subjectOfEmail);
				}
		}
		// Checking whether keyword is present in shortdesc part of the form
		myDocId = Subscribed.findOne(myDoc._id);							
		// Retrieving the value of done field
		doneValue = myDocId.done;
		//alert('value of foundValue '+foundValue);
		if(shortdesc)
		{
			if(!doneValue)
			{
				//alert('inside shortdesc part');
				//console.log('inside shortdesc part of notifcations');
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
							issuesToBeUnmarked = person[j].issuesNotToDisplay;
							//alert('issuesToBeUnmarked.length '+issuesToBeUnmarked.length);
							if(issuesToBeUnmarked && issuesToBeUnmarked.length)
							{
								for(var k=0;k<issuesToBeUnmarked.length;k++)
								{
									if(issuesToBeUnmarked[k] === Issues.findOne(this._id))
									{	
										// Setting flag to mark that user does not want this issue to be checked
										flag=1;    
										break;
									}
								}
							} 
							// Notification to user who has subscribed this issue domain
							if(flag === 0 && Meteor.call('getUserName', subUsers[j]._id))
							{
								var subscribedUserMessage = "Hello "+ Meteor.call('getUserName', subUsers[j]._id) +",\n\n"+
    								comment.author + ' has commented on your subscribed issue having issueId:- ';

								Notifications.insert({
									userId: person[j]._id,
									issueId: issue,
									commentId: comment._id,
									commenterName: comment.author,
									read: false,
									timestamp: new Date()
								});

								Meteor.call('sendEmail',
								   	person[j]._id,
								    senderEmail,
								    subscribedUserMessage,
									issue,
									subjectOfEmail);
							}
							flag =0;		
						}
					}
					// Mail to concerned manager
					Meteor.call('sendEmail',
        	    		managerId,
			        	senderEmail,
			        	managerMsg,
				    	issue,
				    	subjectOfEmail);
				}
			}								
		}
		myDocId = Subscribed.findOne(myDoc._id);							
		doneValue = myDocId.done;
		// Checking whether keyword is present in rest of the part of the form
		if(/*category.match(regEx) ||*/location.match(regEx) && !doneValue)
		{
			// Adding an extra field in the Subscribed collection so that inspite of having multiple occurences of a domain in the form, multiple time notification to the users can be prevented	
			//console.log('inside rest of the form part of notifcations');
			Subscribed.update({category: myDoc.category}, {$set: {done: true}});
			person = myDoc.categorySubscribedUsers;
			if(person && person.length)
			{
				for(j=0;j<person.length;j++)
				{
						
					issuesToBeUnmarked = person[j].issuesNotToDisplay;
					//alert('issuesToBeUnmarked.length '+issuesToBeUnmarked.length);
					if(issuesToBeUnmarked && issuesToBeUnmarked.length)
					{
						for(var k=0;k<issuesToBeUnmarked.length;k++)
						{
							if(issuesToBeUnmarked[k] === Issues.findOne(this._id))
							{
								// Setting flag to mark that user does not want this issue to be checked
								flag=1;  
								break;
							}
						}	 
					}
					// Notification to user who has subscribed this issue domain
					if(flag === 0 && Meteor.call('getUserName', subUsers[j]._id))
					{
						var subscribedUserMessage = "Hello "+ Meteor.call('getUserName', subUsers[j]._id) +",\n\n"+
    						comment.author + ' has commented on your subscribed issue having issueId:- ';

						Notifications.insert({
							userId: person[i]._id,
							issueId: issue,
							commentId: comment._id,
							commenterName: comment.author,
							read: false,
							timestamp: new Date()
						});
						Meteor.call('sendEmail',
					       	person[j]._id,
							senderEmail,
							subscribedUserMessage,
							issue,
							subjectOfEmail);
					}
					flag =0;
				}
			}
			// Mail to concerned manager
			Meteor.call('sendEmail',
        	   	managerId,
		  		senderEmail,
		   		managerMsg,
				issue,
				subjectOfEmail);
		}
						
	});
	//console.log('making the done field false for next issue');

	// Unsetting the  done field to be use next time
	listOfDomain = Subscribed.find();
	listOfDomain.forEach( function(myDoc) 
	{
		Subscribed.update(myDoc._id, {$set: {done: false}});
		//var determine = Subscribed.findOne(myDoc._id);											
		//console.log('value of found field after rest of the form field part '+determine.done);
	});
};

