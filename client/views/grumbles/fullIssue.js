
Template.fullIssue.events({
'click #gg': function () {

	//alert('1');
	var fromEmail = 'grumblebutton@gmail.com';
    var userId = Meteor.user();
    var userName = userId.username;
    var issueRaisedUser = Issues.findOne(this._id).author;
	var issueManagerCategory = Issues.findOne(this._id).category;
	var managerEmailId = Managers.findOne({category: issueManagerCategory}).emailId;
	var managerName = Managers.findOne({category: issueManagerCategory}).name;
	
	if(document.getElementById('gg').checked)
	{
		//alert('inserting of data in issues collection');
		//alert('3');
		
  		//alert('4');
  		Issues.update(this._id, {$addToSet: {subscribedUsers : Meteor.user()}});
  		//alert('5');
		var raisedSubscribedUserMsg = "Hello "+issueRaisedUser +",\n\n"+
    		userName + ' has subscribed to your issue having issueId:- ';
    	
    	var managerSubscribedMsg = "Hello "+ managerName +",\n\n"+
    		userName + ' has subscribed to the issue belonging to your category having issueId:- ';
    	
		var subOfSubscribedIssue = 'Notification of Subscribed Issue';
		if(issueRaisedUser!='')
		{ 
		
			Meteor.call('sendEmail',
        	    	'arora.priya4172@gmail.com',
			        fromEmail,
			        raisedSubscribedUserMsg,
				    this._id,
				    subOfSubscribedIssue);
		}
	
		Meteor.call('sendEmail',
        	    	managerEmailId,
			        fromEmail,
			        managerSubscribedMsg,
				    this._id,
				    subOfSubscribedIssue); 
	}
   	else if (!(document.getElementById('gg').checked))
  	{
  		//alert('pulling of data from issues collection');
  		
	  	//alert('3');
  		var a =  Issues.findOne(this._id);
		var person =  a.subscribedUsers;
		//alert('4');
		
		if(person && person.length)
		{
			var j;
			//alert('5');
			for(j= 0;j< person.length;j++)
			{
				if(person[j].username === Meteor.user().username)
				{	
					
					var personId=person[j]._id;
					Issues.update(this._id,{$pull:{subscribedUsers:{_id:personId}}});
					var raisedUnSubscribedUserMsg = "Hello "+issueRaisedUser +",\n\n"+
    					userName + ' has unsubscribed to your issue having issueId:- ';
    				var managerUnSubscribedMsg = "Hello "+ managerName +",\n\n"+
    					userName + ' has unsubscribed to the issue belonging to your category having issueId:- ';
					var subOfUnSubscribedIssue = 'Notification of UnSubscribed Issue';
					if(issueRaisedUser!='')
					  { 
	
							Meteor.call('sendEmail',
        	    				'arora.priya4172@gmail.com',
			        			fromEmail,
			        			raisedUnSubscribedUserMsg,
				    			this._id,
				    			subOfUnSubscribedIssue);
					}
	
					Meteor.call('sendEmail',
        	    			managerEmailId,
			        		fromEmail,
			        		managerUnSubscribedMsg,
				    		this._id,
				    		subOfUnSubscribedIssue); 

		            break; 
				}
			}
   		
   		}
   	}
}

});

Template.fullIssue.done_checkbox = function () {
	//alert('inside done_checkbox');
	var a =  Issues.findOne(this._id);
	//alert('a');
	var person =  a.subscribedUsers;
	//alert('before if block in done_checkbox person.length'+person.length);
	if(person && person.length)
	{
	//	alert('inside if block of fullIssue');
		var j;
		var ch='';

	//	alert('before loop in done_checkbox');
		for(j= 0;j< person.length;j++)
		{
	//		alert('j '+j);
	//		alert('person '+person[j].username);
			if(person[j].username === Meteor.user().username)
			{	
				ch ="checked";

	//			alert('value of ch that is set'+ch);
				break; 
			}
		}
		if(ch=== 'checked')
		{
	//		alert('while returning value in if block');
			return 'checked="checked"';
		}
		else		
		{
	//		alert('while returning value in else block');
			return '';
		}
		
	}
	else
	{
	//		alert('while returning value in else block');
			return '';
	}
};   

   
// For getting user specific subscribed issues
/*Template.fullIssue.done_checkbox = function () {
	//alert('inside done_checkbox');
	var mgr = Managers.find();
	var ch='';
	//alert('before forEach');
	mgr.forEach( function(myDoc) {
	//	alert('inside forEach');
	//	alert('myDoc.category '+myDoc.category);
	 	if(Issues.findOne(this._id).category === myDoc.category)
		{
	//		alert('inside if comparison');
			var i;
			var person = myDoc.categorySubscribedUsers;
	//		alert('person count '+person.length);
			for(i=0;i<person.length;i++)
			{
				if(Meteor.user().username === person[i].username)
				{
					ch="checked";
	//				alert('value of ch that is set for managers collection'+ch);
					break;
				}


			}
		}
	});
	var a =  Issues.findOne(this._id);
	var person =  a.subscribedUsers;
	if(person && person.length)
	{
		var j;
	//	alert('before loop in done_checkbox');
		for(j= 0;j< person.length;j++)
		{
	//		alert('j '+j);
	//		alert('person '+person[j].username);
			if(person[j].username === Meteor.user().username)
			{	
				ch ="checked";
	//			alert('value of ch that is set'+ch);
				break; 
			}
		}
	}	
	
	if(ch=== 'checked')
	{
	//	alert('while returning value in if block');
		return 'checked="checked"';
	}
	else		
	{
	//	alert('while returning value in else block');
		return '';
	}
};
*/