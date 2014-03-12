/**
 * Template helpers for an issue
 */
Template.issue.done_class = function () {
	
  	return this.done ? 'done' : '';
  					
};

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
	
	
},

'click .check': function () {
		
    var fromEmail = 'grumblebutton@gmail.com';
    var userId = Meteor.user();
    var userName = userId.username;
    //var managerName = Managers.findOne({category:category});
	//var toEmail = Managers.findOne({category:category});  ** HARDCODED **
	var issueRaisedUser = Issues.findOne(this._id).author;
	var issueManagerCategory = Issues.findOne(this._id).category;
	var managerEmailId = Managers.findOne({category: issueManagerCategory}).emailId;
	var managerName = Managers.findOne({category: issueManagerCategory}).name;
	var raisedUserMsg = "Hello "+issueRaisedUser +",\n\n"+
    	userName + ' has subscribed to your issue having issueId:- ';
    var managerMsg = "Hello "+ managerName +",\n\n"+
    	userName + ' has subscribed to the issue belonging to your category having issueId:- ';
	var subject = 'Notification of Subscribed Issue';
	
	
	if(issueRaisedUser!='')
	{ 
	
		Meteor.call('sendEmail',
        	    	'arora.priya4172@gmail.com',
			        fromEmail,
			        raisedUserMsg,
				    this._id,
				    subject);
	}
	
	Meteor.call('sendEmail',
        	    	managerEmailId,
			        fromEmail,
			        managerMsg,
				    this._id,
				    subject);

//	alert('after sending email');
//	alert('first time done value'+this.done);
    Issues.update(this._id, {$set: {done: !this.done}});
  //  alert('updating the done word '+this.done);
   	Issues.update(this._id, {$addToSet: {subscribedUsers : Meteor.user()}});



  /*  alert('before updating db, comparing the values'+this.done);
    if(document.querySelector('.check:checked').checked)
    {

    	alert('adding subscriber name to db');
    	alert('this.done '+ this.done);
    	Issues.update(this._id, {$addToSet: {subscribedUsers : Meteor.user()}});
    	alert('value updated to issue db in user subscription');	
	}
	else if(document.querySelector('.check:checked').checked === 'false') // if (this.done === 'true')
	{
		alert('while unsubscribing the issue');
		alert('this.done '+ this.done);
		//Issues.update(this._id, {$set: {done: !this.done}});
		var a =  Issues.findOne(this._id);
		var person =  a.subscribedUsers;
		alert(person.length);
		alert('value of done in unsubscription part'+ this.done);
		if(person && person.length)
		{
			var j;
			alert('before enetring loop in unsubscription part');
			for(j= 0;j< person.length;j++)
			{
				alert(j);
				alert('person '+person[j].username);
				alert('id '+person[j]._id);
				if(person[j].username === Meteor.user().username)
				{	
					
					var personId=person[j]._id;
					Issues.update(this._id,{$pull:{subscribedUsers:{_id:personId}}});
		            break; 
				}
			}
	
		}
	
	}
    */

    }
});
   
// For getting user specific subscribed issues
Template.issue.done_checkbox = function () {
	
	//alert('inside done_checkbox');
	var a =  Issues.findOne(this._id);
	var person =  a.subscribedUsers;
	if(person && person.length)
	{
		var j;
		var ch='';
	//	alert('done_checkbox username '+Meteor.user().username);
		for(j= 0;j< person.length;j++)
		{
	//		alert(j);
	//		alert('person '+person[j].username);
			if(person[j].username === Meteor.user().username)
			{	
				ch ="checked";
	//			alert('value of ch that is checked'+ch);
				break; 
			}
		}
		if(ch === 'checked')
		{
			return 'checked="checked"';
		}
		else		
			return '';
		
	}
	else
		return '';

};

