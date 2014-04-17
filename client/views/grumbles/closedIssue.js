/**
 * Template helpers for a closed issue
 */

Template.closedIssue.events({
 'click #gg': function () {
 	
	//alert('inside closedIssue -> resetting issueClosed field value');
	// Adding a new field to detect whether issue is open or closed
   	Issues.update(this._id, {$set: {issueClosed: 0}});

   	var userId = Issues.findOne(this._id).userId;
	var issueRaisedUserEmailId = Issues.findOne(this._id).authorEmailId;
	var msg = Issues.findOne(this._id).shortdesc; 
	var id = this._id;
	//alert('msg '+msg);
	
   	var senderEmail = 'grumblebutton@gmail.com';
	/*var category = docs1.category;*/
	var category = Issues.findOne(this._id).category; 

	//alert('category '+category);
	var subjectOfEmail = "Opening of Issue";

	// mail to manager regarding opening of issue
	if(Subscribed.findOne({category:category}))
	{
		var receiverEmail = Subscribed.findOne({category:category});	
		var managerName = Subscribed.findOne({category:category});	
		var managerMessage = "Hello "+managerName.name+",\n\n"+
        				". The following issue has been opened - "+msg +".\n\n"+
        				"The link for the concerned issue is :- http://localhost:3000/closedIssues/";
        //alert('mail to mgr regarding opening of issue');
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
    // Mail to user who has posted the issue regarding it's opening
	if(Issues.findOne(this._id).author) // NEW ONE
	{
		var userMessage = "Hello "+Issues.findOne(this._id).author+",\n\n"+   // NEW ONE -> docs.author
        				". The following issue has been opened - "+msg +".\n\n"+
        				"The link for the concerned issue is :- http://localhost:3000/closedIssues/";
        
        //alert('mail to user regarding opening of issue');
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
	if(Issues.findOne(this._id).subscribedUsers)
	{
		var subscribedPerson = Issues.findOne(this._id).subscribedUsers;
		if(subscribedPerson.length)
		{
			for(i=0;i<subscribedPerson.length;i++)
			{
				var subscribedUserMessage = "Hello "+subscribedPerson[i].username+",\n\n"+
        				". The following issue has been opened - "+msg +".\n\n"+
        				"The link for the concerned issue is :- http://localhost:3000/closedIssues/";
        		//alert('mail to subsribed user regarding opening of issue');
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
	

	// Mail to user who has subscribed to domain but not to this issue
	var listOfDomain = Subscribed.find();
	listOfDomain.forEach( function(myDoc) 
	{
		if(myDoc.category === category)
		{
			var person = myDoc.categorySubscribedUsers;
			if(person && person.length)
			{
				for(j=0;j<person.length;j++)
				{
					// mail to those subscribed users
					var subscribedUserMessage = "Hello "+person[j].username+",\n\n"+
        				". The following issue has been opened - "+msg +".\n\n"+
        				"The link for the concerned issue is :- http://localhost:3000/closedIssues/";

       					//alert('mail to subsribed user for domain but not to this issue regarding opening of issue');
						Meteor.call('sendEmail',
		      	    	   	person[j].emails[0].address,
		   			        senderEmail,
				            subscribedUserMessage,
		        			this._id,
					        subjectOfEmail); 

						Notifications.insert({
							userId: person[j]._id, // users id who has posted the issue
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
	});

   }
});




   

