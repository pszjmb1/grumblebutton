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
	var id = this._id;
	//alert('msg '+msg);
	
   	var senderEmail = 'grumblebutton@gmail.com';

	var category = Issues.findOne(this._id).category; 

	//alert('category '+category);
	var subjectOfEmail = "Closing of Issue";
	// mail to manager
	if(Subscribed.findOne({category:category}))
	{
		var receiverEmail = Subscribed.findOne({category:category});	
		var managerName = Subscribed.findOne({category:category});	
		var managerMessage = "Hello "+managerName.name+",\n\n"+
        				". The following issue has been closed - "+msg +".\n\n"+
        				"The link for the concerned issue is :- http://localhost:3000/closedIssues/";
  		//alert('mail to mgr regarding closing of isue');
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
	
    //alert('author  '+author);
    // To send mail to user
	if(Issues.findOne(this._id).author) 
	{
		var userMessage = "Hello "+Issues.findOne(this._id).author+",\n\n"+   
        				". The following issue has been closed - "+msg +".\n\n"+
        				"The link for the concerned issue is :- http://localhost:3000/closedIssues/";
        //alert('mail to user regarding closing of issue');
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
					closerId:Meteor.user() ,
					closerName: Meteor.user().username,
					read: false
		});	
        // To make sure that user who has posted the issue can close it
	    /*if(Meteor.user().username == docs1.author)
	    {
	    	Issues.remove(this._id)   // for issue to be closed by manager only
			ClosedIssues.insert(docs1)
		}*/
	}

	// Mail to subscribed users
	if(Issues.findOne(this._id).subscribedUsers)
	{
		var subscribedPerson = Issues.findOne(this._id).subscribedUsers;
		if(subscribedPerson.length)
		{
			for(i=0;i<subscribedPerson.length;i++)
			{
				var subscribedUserMessage = "Hello "+subscribedPerson[i].username+",\n\n"+
        				". The following issue has been closed - "+msg +".\n\n"+
        				"The link for the concerned issue is :- http://localhost:3000/closedIssues/";
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
					closerId:Meteor.user() ,
					closerName: Meteor.user().username,
					read: false
				});	
			}
		}
	}
	

	// Mail to user who has subscribed to domain but of this issue
	var listOfDomain = Subscribed.find();
	//alert('mgr taken');
	listOfDomain.forEach( function(myDoc) 
			{
				//alert('inside mgr forEach');
				//alert('myDoc.category '+myDoc.category);
				//alert('this._id '+this._id);
				//alert('Issues.findOne(this._id).category '+category);
				if(myDoc.category === category)
				{
					//alert('before taking subscribed users from subscribed collection');
					var person = myDoc.categorySubscribedUsers;
					//alert('person.length '+person.length);
					if(person && person.length)
					{
						for(j=0;j<person.length;j++)
						{
							//alert('person[j].username '+person[j].username);
							// mail to those subscribed users
							var subscribedUserMessage = "Hello "+person[j].username+",\n\n"+
        					". The following issue has been closed - "+msg +".\n\n"+
        					"The link for the concerned issue is :- http://localhost:3000/closedIssues/";

        					//alert('mail to  subscribed user  for domain but not to this issue regarding closing of issue');
							Meteor.call('sendEmail',
			       	    	   	person[j].emails[0].address,
		    			        senderEmail,
					            subscribedUserMessage,    // NEED TO ADD THE CONDITION THAT IF USER HAS WITHDRAWN FROM THIS ISSUE ONLY THEN NO NEED TO SEND THE MAIL
			        			this._id,
						        subjectOfEmail); 

							Notifications.insert({
								userId: person[j]._id, // users id who has posted the issue
								issueId: this._id,   // issue id
								//commentId: comment._id,
								//commenterName: comment.author,
								closerId:Meteor.user() ,
								closerName: Meteor.user().username,
								read: false
							});	
						}
					}
				}
			});
}
});
  
 