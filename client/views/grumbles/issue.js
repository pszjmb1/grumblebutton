/**
 * Template helpers for closing an issue
 */

//Event to close the issue. 
Template.issue.events({
'click .destroy': function () {
	//alert('inside issue.js -> destroy');

	// Adding a field to differentiate the closed issue from rest of the issues
   	Issues.update(this._id, {$set: {issueClosed: 1}});
   	var issueRaisedUserId = Issues.findOne(this._id).userId;
  	var issueRaisedUserEmailId = Issues.findOne(this._id).authorEmailId;
	var msg = Issues.findOne(this._id).shortdesc; 
	var details =  Issues.findOne(this._id).details;
	var shortdesc = msg;
	var unit =  Issues.findOne(this._id).unit;
	var dept =  Issues.findOne(this._id).dept;
	var category =  Issues.findOne(this._id).category;
	var id = this._id;
	var issueRaisedUser = Issues.findOne(this._id).author;
	//alert('msg '+msg);
	var senderEmail = 'grumblebutton@gmail.com';
	var category = Issues.findOne(this._id).category; 
	//alert('category '+category);
	var subjectOfEmail = "Closing of Issue";
	var person ='', issuesToBeUnmarked='', regEx='';
	// Mail to manager regarding closing of issue
	// alert('mail to manager regarding closing of Issue');
	if(Subscribed.findOne({category:category}))
	{
		var receiverEmail = Subscribed.findOne({category:category});	
		var managerName = Subscribed.findOne({category:category});	
		var managerMessage = "Hello "+managerName.name+",\n\n"+
        	". The following issue has been closed - "+msg +".\n\n"+
        	"The link for the concerned issue is :- http://localhost:15000/closedIssues/";
  		//alert('mail to mgr regarding closing of isue');
		Meteor.call('sendEmail',
        	receiverEmail.emailId,
		    senderEmail,
		    managerMessage,
		    id,
		   subjectOfEmail); 
		// To make sure that user who has posted the issue can only close it
        /*if(managerName.name == Meteor.user().username)
		{
			Issues.remove(this._id)
			ClosedIssues.insert(docs1)
		}*/
	}
	// alert('author  '+author);
    // Mail to user
    // alert('mail to user regarding closing of Issue');
	if(issueRaisedUser!='anonymous')
	{
		var userMessage = "Hello "+Issues.findOne(this._id).author+",\n\n"+   
        	". The following issue has been closed - "+msg +".\n\n"+
        	"The link for the concerned issue is :- http://localhost:15000/closedIssues/";
        // alert('mail to user regarding closing of issue');
        Meteor.call('sendEmail',
           	issueRaisedUserEmailId,
		    senderEmail,
		    userMessage,
		    id,
			subjectOfEmail); 

        Notifications.insert({
			userId: issueRaisedUserId, // users id who has posted the issue
			issueId: this._id,   // issue id
			//commentId: comment._id,
			//commenterName: comment.author,
			closerId:Meteor.userId() ,
			closerName: Meteor.user().username,
			read: false,
			timestamp: new Date()
		});	
        // To make sure that user who has posted the issue can close it
	    /* if(Meteor.user().username == docs1.author)
	    {
	    	Issues.remove(this._id)   // for issue to be closed by manager only
			ClosedIssues.insert(docs1)
		}*/
	}

	// Mail to subscribed users
	//alert('mail to subscribed users of issue not domain regarding closing of issue');
	if(Issues.findOne(this._id).subscribedUsers)
	{
		var subscribedPerson = Issues.findOne(this._id).subscribedUsers;
		if(subscribedPerson.length)
		{
			for(i=0;i<subscribedPerson.length;i++)
			{
				var subscribedUserMessage = "Hello "+subscribedPerson[i].username+",\n\n"+
        			". The following issue has been closed - "+msg +".\n\n"+
        			"The link for the concerned issue is :- http://localhost:15000/closedIssues/";
        		//alert('mail to  subscribed user regarding closing of issue');
				Meteor.call('sendEmail',
       	    	   	subscribedPerson[i].emails[0].address,
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
					closerName: Meteor.user().username,
					read: false,
					timestamp: new Date()
				});	
			}
		}
	}
	
	// Flag indicates that domain name has been found in any part of the form
	var flag =0;
	// Mail to user who has subscribed to domain but of this issue
	//alert('Mail to all subscribed users of the domain but not to this issue');
	var listOfDomain = Subscribed.find();
	listOfDomain.forEach( function(myDoc) 
	{
		//alert('myDoc._id '+myDoc._id);
		// Creating regular expression to check all possible format in which user can enter domain name
		regEx = new RegExp("^.*"+myDoc.category+".*","gi"); 

		// Checking whether domain name is present in the detils part of the form
		if(details)
		{
			if(details.match(regEx))
			{										
				// alert('inside details regular expression');
				// Users who have subscribed to that domain, from Subscribed collection
 		 		person = myDoc.categorySubscribedUsers;
				// alert('before person loop in details part');
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
									flag=1;    
									break;
								}
							}	 
						}
						// alert('flag ==0 in details part');
						if(flag === 0)
						{
							//Meteor.Router.to('issuePage', id);
							var subscribedUserMessage = "Hello "+person[j].username+",\n\n"+
    	    					". The following issue has been closed - "+msg +".\n\n"+
        						"The link for the concerned issue is :- http://localhost:15000/closedIssues/";
										
							// Notification to all subscribed Users of that domain
							// alert('mail to subscribed users in details part ');
							// alert('senderEmail '+senderEmail);
							// alert('person[j].emails[0].address '+person[j].emails[0].address);
							// alert('messageToSubscribedUsers '+messageToSubscribedUsers);
							// alert('id '+id);
							// alert('subjectOfEmail '+subjectOfEmail)
							// alert('mail to subscribed domain user in details part');
							Meteor.call('sendEmail',
        			 	   	   	person[j].emails[0].address,  
	        	    	     	senderEmail,
	            	  		   	subscribedUserMessage,
					 			id,
					    		subjectOfEmail); 
								// alert('notification to subscribed domain user in details part');
							Notifications.insert({
								userId: person[j]._id, // users id who has posted the issue
								issueId: this._id,   // issue id
								//commentId: comment._id,
								//commenterName: comment.author,
								postedUserId:Meteor.user() ,
								postedUserName: Meteor.user().username,
								read: false,
								timestamp: new Date()
							});	
						}		
						// Adding an extra field in the Subscribed collection so that inspite of having multiple occurences of a domain in the form, multiple time notification to the users can be prevented
						//alert('before updating field in details part');
						Subscribed.update(myDoc._id, {$set: {found: 1}});
							flag =0;
							//var determine = Subscribed.findOne(myDoc._id);
							//alert('value of found field after details part ');

					}
				}
							
			}
		}
					
		// Checking whether keyword is present in shortdesc part of the form
		myDocId = Subscribed.findOne(myDoc._id);							
		// FoundValue retreive the value of found field
		foundValue = myDocId.found;
		//alert('value of foundValue '+foundValue);
		if(shortdesc)
		{
			if(!foundValue)
			{
				//alert('inside shortdesc part');
				if(shortdesc.match(regEx))
				{
					// alert('category matches with shortdesc part');
					// Users who have subscribed to that domain, from Subscribed collection
 			 		person = myDoc.categorySubscribedUsers;
 			 		if(person && person.length)
					{
						// alert('before person loop in shortdesc part');
						for(j=0;j<person.length;j++)
						{
							issuesToBeUnmarked = person[j].issuesNotToDisplay;
							// alert('issuesToBeUnmarked.length '+issuesToBeUnmarked.length);
							if(issuesToBeUnmarked && issuesToBeUnmarked.length)
							{
								for(var k=0;k<issuesToBeUnmarked.length;k++)
								{
									if(issuesToBeUnmarked[k] === Issues.findOne(this._id))
									{
										flag=1;     // here flag indicating that current issue is in not to be shown list of the user
										break;
									}
								} 
							}
							// alert('flag ==0 in shortdesc part');
							if(flag === 0)
							{
								var subscribedUserMessage = "Hello "+person[j].username+",\n\n"+
				        			". The following issue has been closed - "+msg +".\n\n"+
    	    						"The link for the concerned issue is :- http://localhost:15000/closedIssues/";
								// Notification to all subscribed Users
								// alert('mail to subscribed users in shortdesc part');
								Meteor.call('sendEmail',
									person[j].emails[0].address,
    	    	 	   	   			senderEmail,
	    	          	    		subscribedUserMessage,
									id,
						           	subjectOfEmail); 

								// alert('notification to subscribed user in shortdesc part');
								Notifications.insert({
									userId: person[j]._id, // users id who has posted the issue
									issueId: this._id,   // issue id
									//commentId: comment._id,
									//commenterName: comment.author,
									postedUserId:Meteor.user() ,
									postedUserName: Meteor.user().username,
									read: false,
									timestamp: new Date()
								});	
							}		
							// Adding an extra field in the Subscribed collection so that inspite of having multiple occurences of a domain in the form, multiple time notification to the users can be prevented	
							Subscribed.update(myDoc._id, {$set: {found: 1}});
							flag =0;
							//var determine = Subscribed.findOne(myDoc._id);
							//alert('value of found field after shortdesc part '+determine.found);
						}
					}
				}	
			}								
		}
		myDocId = Subscribed.findOne(myDoc._id);							
		foundValue = myDocId.found;
		// Checking whether keyword is present in rest of the part of the form
		if((category.match(regEx) ||dept.match(regEx) || unit.match(regEx)) && !foundValue)
		{
					
			//alert('inside rest of the form part');
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
								flag=1;     // here flag indicating that current issue is in not to be shown list of the user
								break;
							}
						}	 
					}
					// alert('flag ==0 in rest of the part');
					if(flag === 0)
					{
						var subscribedUserMessage = "Hello "+person[j].username+",\n\n"+
	        				". The following issue has been closed - "+msg +".\n\n"+
    	    				"The link for the concerned issue is :- http://localhost:15000/closedIssues/";
						// Notification to all subscribed Users
						// alert('mail to subscribed users in rest of the form part');
						Meteor.call('sendEmail',
    	    	 	   	   	person[j].emails[0].address, 
	    	             	senderEmail,
	        	   			subscribedUserMessage,
				  			id,
			        		subjectOfEmail); 

							// alert('notification to subscribed users in rest of the form part');
						Notifications.insert({
							userId: person[j]._id, // users id who has posted the issue
							issueId: this._id,   // issue id
							//commentId: comment._id,
							//commenterName: comment.author,
							postedUserId:Meteor.user() ,
							postedUserName: Meteor.user().username,
							read: false,
							timestamp: new Date()
						});	
					}		
					// Adding an extra field in the Subscribed collection so that inspite of having multiple occurences of a domain in the form, multiple time notification to the users can be prevented	
					Subscribed.update(myDoc._id, {$set: {found: 1}});
					flag =0;
					//var determine = Subscribed.findOne(myDoc._id);											
					//alert('value of found field after rest of the form field part '+determine.found);						
				}
			}
		}
	});
	//alert('making the found field 0 for next issue');
	listOfDomain = Subscribed.find();
	// Unsetting the found field value to be used in next iteration
	listOfDomain.forEach( function(myDoc) 
	{

		Subscribed.update(myDoc._id, {$set: {found: 0}});
		//var determine = Subscribed.findOne(myDoc._id);											
		//alert('value of found field after rest of the form field part '+determine.found);

	});   

}
});
  
 