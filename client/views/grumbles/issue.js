/**
 * Template helpers for an issue
 */
Template.issue.events({
 'click .destroy': function () {
   	//Issues.update(this._id, {$set: {closed: !this.closed}});
	var docs1 = Issues.findOne(this._id);
	//docs.forEach(function(doc) { ClosedIssues.insert(doc) });
	ClosedIssues.insert(docs1)
	var msg = docs1.shortdesc;
	var id = this._id;
	//alert('id removed');
	Issues.remove(this._id);
   
	var fromEmail = 'grumblebutton@gmail.com';
	var category = docs1.category;
	//alert('category '+category);
	var subject = "Closing of Issue";
	if(Managers.findOne({category:category}))
	{
		var toEmail = Managers.findOne({category:category});	
		var managerName = Managers.findOne({category:category});	
		var managerMessage = "Hello "+managerName.name+",\n\n"+
        				". The following issue has been closed - "+msg +".\n\n"+
        				"The link for the concerned issue is :- http://localhost:3000/closedIssues/";
        // Mail to manager
		Meteor.call('sendEmail',
        	    	toEmail.emailId,
			        fromEmail,
			        managerMessage,
				    id,
				    subject); 
        /*if(managerName.name == Meteor.user().username)
		{
			Issues.remove(this._id)
			ClosedIssues.insert(docs1)
		}*/
	}
	
    //alert('author  '+author);
	if(docs1.author)
	{
		var userMessage = "Hello "+docs1.author+",\n\n"+
        				". The following issue has been closed - "+msg +".\n\n"+
        				"The link for the concerned issue is :- http://localhost:3000/closedIssues/";
        // Mail to user
        Meteor.call('sendEmail',
        	   	   	"arora.priya4172@gmail.com",
			        fromEmail,
		            userMessage,
				    id,
				    subject); 
	    /*if(Meteor.user().username == docs1.author)
	    {
	    	Issues.remove(this._id)   // for issue to be closed by manager only
			ClosedIssues.insert(docs1)
		}*/
	}

	// Mail to subscribed users
	if(docs1.subscribedUsers)
	{
		var subscribedPerson = docs1.subscribedUsers;
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
  
 