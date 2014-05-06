/**
 * Template helpers for a closed issue
 */

Template.closedIssue.events({
 'click #press': function () {
 	
	//alert('inside closedIssue -> resetting issueClosed field value');
	// Updating the issueClosed field to 0 while reopening the issue
   	Issues.update(this._id, {$set: {issueClosed: 0}});
  	var userId = Issues.findOne(this._id).userId;
	var issueRaisedUserEmailId = Issues.findOne(this._id).authorEmailId;
	var msg = Issues.findOne(this._id).shortdesc; 
	var id = this._id;
	// alert('msg '+msg);
	
   	var senderEmail = 'grumblebutton@gmail.com';
	/*var category = docs1.category;*/
	var category = Issues.findOne(this._id).category; 
	var details = Issues.findOne(this._id).details;
	var shortdesc = msg;
	var unit = Issues.findOne(this._id).unit;
	var dept = Issues.findOne(this._id).dept;

	// alert('category '+category);
	var subjectOfEmail = "Opening of Issue";
	var person='', regEx='', issuesToBeUnmarked='';

	// Mail to manager regarding opening of issue
	// alert('mail to manager regarding opening of issue');
	if(Subscribed.findOne({category:category}))
	{
		var receiverEmail = Subscribed.findOne({category:category});	
		var managerName = Subscribed.findOne({category:category});	
		var managerMessage = "Hello "+managerName.name+",\n\n"+
        	". The following issue has been opened - "+msg +".\n\n"+
       		"The link for the concerned issue is :- http://localhost:15000/closedIssues/";
		// alert('mail to mgr regarding opening of issue');
		Meteor.call('sendEmail',
        	receiverEmail.emailId,
		    senderEmail,
		    managerMessage,
		    id,
		    subjectOfEmail); 


		// To make sure that user who has posted the issue can close it
        /*if(managerName.name == Meteor.user().username)
		{
			Issues.remove(this._id)
			ClosedIssues.insert(docs1)
		}*/
	}
	
    // alert('author  '+author);
    // Mail to user who has posted the issue regarding it's opening
	// alert('mail to user regarding opening of issue');
	if(Issues.findOne(this._id).author!='anonymous') 
	{
		var userMessage = "Hello "+Issues.findOne(this._id).author+",\n\n"+   
        	". The following issue has been opened - "+msg +".\n\n"+
        	"The link for the concerned issue is :- http://localhost:15000/closedIssues/";
        
		// alert('mail to user regarding opening of issue');
        Meteor.call('sendEmail',
           	issueRaisedUserEmailId,
		    senderEmail,
		    userMessage,
		    id,
		    subjectOfEmail); 


        Notifications.insert({
			userId: userId, // users id who has posted the issue
			issueId: this._id,   // issue id
			//commentId: comment._id,
			//commenterName: comment.author,
			openerId:Meteor.user() ,
			openerName: Meteor.user().username,
			read: false
		});	
        // To make sure that user who has posted the issue can close it
	    /*if(Meteor.user().username == docs1.author)
	    {
	    	Issues.remove(this._id)   // for issue to be closed by manager only
			ClosedIssues.insert(docs1)
		}*/
	}

	// Mail to users who have subscribed to this issue
	// alert('mail to subscribed users regarding opening of issue');
	if(Issues.findOne(this._id).subscribedUsers)
	{
		var subscribedPerson = Issues.findOne(this._id).subscribedUsers;
		if(subscribedPerson && subscribedPerson.length)
		{
			for(i=0;i<subscribedPerson.length;i++)
			{
				var subscribedUserMessage = "Hello "+subscribedPerson[i].username+",\n\n"+
        			". The following issue has been opened - "+msg +".\n\n"+
        			"The link for the concerned issue is :- http://localhost:15000/closedIssues/";
				// alert('mail to subsribed user regarding opening of issue');
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
					openerId:Meteor.user() ,
					openerName: Meteor.user().username,
					read: false
				});	
			}
		}
	}
	var flag =0;

	// Mail to user who has subscribed to domain but not to this issue
	// alert('mail to subscribed users of domain regarding opening of issue');
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
				//	alert('inside details regular expression');
				// Users who have subscribed to that domain, from Subscribed collection
 		 		person = myDoc.categorySubscribedUsers;
				//	alert('before person loop in details part');
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
									// Flag to indicate that current issue not be checked
									flag=1;     
											
									break;
								}
							} 
						}
						// alert('flag ==0 details part');
						if(flag === 0)
						{
							//Meteor.Router.to('issuePage', id);
							var subscribedUserMessage = "Hello "+person[j].username+",\n\n"+
    	    					". The following issue has been opened - "+msg +".\n\n"+
        						"The link for the concerned issue is :- http://localhost:15000/closedIssues/";
										
							// Notification to all subscribed Users of that domain
							// alert('mail to subscribed users in details part opening of issue');
							// alert('senderEmail '+senderEmail);
							// alert('person[j].emails[0].address '+person[j].emails[0].address);
							// alert('messageToSubscribedUsers '+messageToSubscribedUsers);
							// alert('id '+id);
							//alert('subjectOfEmail '+subjectOfEmail)
							Meteor.call('sendEmail',
        		 				person[j].emails[0].address,
	        	    	    	senderEmail,
	            	  		    subscribedUserMessage,
						   		id,
					    		subjectOfEmail); 

							// alert('notification to subscribed users in details part opening of issue');
							Notifications.insert({
								userId: person[j]._id, // users id who has posted the issue
								issueId: this._id,   // issue id
								//commentId: comment._id,
								//commenterName: comment.author,
								postedUserId:Meteor.user() ,
								postedUserName: Meteor.user().username,
								read: false
							});	
						}
						// Adding an extra field in the Subscribed collection so that inspite of having multiple occurences of a domain in the form, multiple time notification to the users can be prevented
						// alert('before updating field');
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
		foundValue = myDocId.found;
		//alert('value of foundValue '+foundValue);
		if(shortdesc)
		{
			if(!foundValue)
			{
				// alert('inside shortdesc part');
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
							//alert('issuesToBeUnmarked.length '+issuesToBeUnmarked.length);
							if(issuesToBeUnmarked && issuesToBeUnmarked.length)
							{
								for(var k=0;k<issuesToBeUnmarked.length;k++)
								{
									if(issuesToBeUnmarked[k] === Issues.findOne(this._id))
									{
										// Flag to indicate that current issue not be checked
										flag=1; 
										break;
									}
								}	 
							}
							// alert('flag ==0 in shortdesc');
							if(flag === 0)
							{
								var subscribedUserMessage = "Hello "+person[j].username+",\n\n"+
				        			". The following issue has been opened - "+msg +".\n\n"+
        							"The link for the concerned issue is :- http://localhost:15000/closedIssues/";
								// Notification to all subscribed Users
								//	alert('mail to subscribed users in shortdesc part opening of issue');
								Meteor.call('sendEmail',
									person[j].emails[0].address,
        		 	   	   			senderEmail,
	        	      	    		subscribedUserMessage,
						   	   		id,
						           	subjectOfEmail); 

								// alert('notification to subscribed users in shortdesc part opening of issue');
								Notifications.insert({
									userId: person[j]._id, // users id who has posted the issue
									issueId: this._id,   // issue id
									//commentId: comment._id,
									//commenterName: comment.author,
									postedUserId:Meteor.user() ,
									postedUserName: Meteor.user().username,
									read: false
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
					
			// alert('inside rest of the form part');
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
								// Flag to indicate that current issue not be checked
								flag=1;
								break;
							}
						} 
					}
					// alert('flag ==0 in rest o fthe form')
					if(flag === 0)
					{
						var subscribedUserMessage = "Hello "+person[j].username+",\n\n"+
        					". The following issue has been opened - "+msg +".\n\n"+
	        				"The link for the concerned issue is :- http://localhost:15000/closedIssues/";

						// Notification to all subscribed Users
						//	alert('mail to subscribed users in rest of the form part opening of issue');
						Meteor.call('sendEmail',
	        	 	   	    person[j].emails[0].address,  // NEED TO BE CHANGED ACCORDING TO THE USER EMAIL ID  person[j].emails[0].address
		                 	senderEmail,
	    	          	    subscribedUserMessage,
				 			id,
				       		subjectOfEmail); 

						// alert('notification to subscribed users in rest of the form part opening of issue');
						Notifications.insert({
							userId: person[j]._id, // users id who has posted the issue
							issueId: this._id,   // issue id
							//commentId: comment._id,
							//commenterName: comment.author,
							postedUserId:Meteor.user() ,
							postedUserName: Meteor.user().username,
							read: false
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
			
	//	alert('making the found field 0 for next issue');

	// Making the found field to be 0 for to be use next time
	var domainList = Subscribed.find();
	domainList.forEach( function(myDoc) 
	{
		Subscribed.update(myDoc._id, {$set: {found: 0}});
		//var determine = Subscribed.findOne(myDoc._id);											
		//alert('value of found field after rest of the form field part '+determine.found);
	}); 
}
});




   

