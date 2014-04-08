/**
 * Template helpers for an issue
 */

// Event to close the issue. 
Template.issue.events({
 'click .destroy': function () {
 	alert('inside issue.js -> destroy');
   	Issues.update(this._id, {$set: {issueClosed: 1}});
  
	/*var docs1 = Issues.findOne(this._id);
	var msg = docs1.shortdesc; 
	*/
	var msg = Issues.findOne(this._id).shortdesc; // NEW ONE
	var id = this._id;
	alert('msg '+msg);
	
   	var fromEmail = 'grumblebutton@gmail.com';
	/*var category = docs1.category;*/
	var category = Issues.findOne(this._id).category; // NEW ONE

	alert('category '+category);
	var subject = "Closing of Issue";
	// mail to manager
	if(Subscribed.findOne({category:category}))
	{
		var toEmail = Subscribed.findOne({category:category});	
		var managerName = Subscribed.findOne({category:category});	
		var managerMessage = "Hello "+managerName.name+",\n\n"+
        				". The following issue has been closed - "+msg +".\n\n"+
        				"The link for the concerned issue is :- http://localhost:3000/closedIssues/";
        
		Meteor.call('sendEmail',
        	    	toEmail.emailId,
			        fromEmail,
			        managerMessage,
				    id,
				    subject); 
		// To make sure that user who has posted the issue can close it
        /*if(managerName.name == Meteor.user().username)
		{
			Issues.remove(this._id)
			ClosedIssues.insert(docs1)
		}*/
	}
	
    //alert('author  '+author);
    // To send mail to user
	/*if(docs1.author)*/
	if(Issues.findOne(this._id).author) // NEW ONE
	{
		var userMessage = "Hello "+Issues.findOne(this._id).author+",\n\n"+   // NEW ONE -> docs.author
        				". The following issue has been closed - "+msg +".\n\n"+
        				"The link for the concerned issue is :- http://localhost:3000/closedIssues/";
        
        Meteor.call('sendEmail',
        	   	   	"arora.priya4172@gmail.com",
			        fromEmail,
		            userMessage,
				    id,
				    subject); 
        // To make sure that user who has posted the issue can close it
	    /*if(Meteor.user().username == docs1.author)
	    {
	    	Issues.remove(this._id)   // for issue to be closed by manager only
			ClosedIssues.insert(docs1)
		}*/
	}

	// Mail to subscribed users
	/*if(docs1.subscribedUsers) */
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
				Meteor.call('sendEmail',
       	    	   	"arora.priya4172@gmail.com",
		            fromEmail,
		            subscribedUserMessage,
			        this._id,
			        subject); 
			}
		}
	}
	
	
}
});
  
 