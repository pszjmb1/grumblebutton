/*
Template.subscribedKeyword.events({
'click #pp': function () {

	alert('1');
	var fromEmail = 'grumblebutton@gmail.com';
    var userId = Meteor.user();
    var userName = userId.username;

	var issueManagerCategory = Managers.findOne(this._id).category;
	//alert('issueManagerCategory' + issueManagerCategory);
	var managerEmailId = Managers.findOne({category: issueManagerCategory}).emailId;
	var managerName = Managers.findOne({category: issueManagerCategory}).name;
	alert('before checking checkbox');

	if(!document.getElementById('pp').checked)
	{
		alert('inserting of data in managers collection');
		//alert('3');
		
  		//alert('4');
  		Managers.update(this._id, {$addToSet: {categorySubscribedUsers: Meteor.user()}});
  		//alert('5');

    	var managerSubscribedMsg = "Hello "+ managerName +",\n\n"+
    		userName + ' has subscribed to the issue belonging to your category having issueId:- ';
    	
		var subOfSubscribedKeyword = 'Notification of Subscribed Domain';
		Meteor.call('sendEmail',
        	    	managerEmailId,
			        fromEmail,
			        managerSubscribedMsg,
				    this._id,
				    subOfSubscribedKeyword); 
	}
   	else if ((document.getElementById('pp').checked))
  	{
  		alert('pulling of data from managers collection');
  		
	  	//alert('3')

  		var a =  Managers.findOne(this._id);
		var person =  a.categorySubscribedUsers;
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
					Managers.update(this._id,{$pull:{categorySubscribedUsers:{_id:personId}}});
					
    				var managerUnSubscribedMsg = "Hello "+ managerName +",\n\n"+
    					userName + ' has unsubscribed to the issue belonging to your category having issueId:- ';
					var subOfUnSubscribedKeyword = 'Notification of UnSubscribed Domain';
					
					Meteor.call('sendEmail',
        	    			managerEmailId,
			        		fromEmail,
			        		managerUnSubscribedMsg,
				    		this._id,
				    		subOfUnSubscribedKeyword); 

		            break; 
				}
			}
   		
   		}
   	}
}

});

Template.subscribedKeyword.done= function () {
	alert('inside done_checkbox');
	var a =  Managers.findOne(this._id);
	//alert('a');
	var person =  a.categorySubscribedUsers;
	alert('before if block in done_checkbox ');
	if(person && person.length)
	{
		
		var j;
		var ch='';

		alert('before loop in done_checkbox');
		for(j= 0;j< person.length;j++)
		{
			alert('j '+j);
			alert('person '+person[j].username);
			if(person[j].username === Meteor.user().username)
			{	
				ch ="checked";

				alert('value of ch that is set'+ch);
				break; 
			}
		}
		if(ch=== 'checked')
		{
			alert('while returning value in if block');
			return 'checked="checked"';
		}
		else		
		{
			alert('while returning value in else block');
			return '';
		}
		
	}
	else
	{
			alert('while returning value in else block');
			return '';
	}
};   
*/

Template.subscribedKeyword.events({
'click #pp': function () {

	alert('1');
	var fromEmail = 'grumblebutton@gmail.com';
    var userId = Meteor.user();
    var userName = userId.username;
   	var issueManagerCategory = Managers.findOne(this._id).category;
	var managerEmailId = Managers.findOne({category: issueManagerCategory}).emailId;
	var managerName = Managers.findOne({category: issueManagerCategory}).name;
	alert('before if block of subscribedKeyword');
	if(document.getElementById('pp').checked)
	{
		alert('inserting of data in managers collection');
		alert('3');
		Managers.update(this._id, {$addToSet: {categorySubscribedUsers : Meteor.user()}});
		
		alert('4');
		var msg = "Hello "+ managerName +",\n\n"+
    		userName + ' has subscribed to your category';
    	var subOfSubscribedDomain = 'Notification of Subscribed Domain';
    	alert('before sending mail to mgr');
		Meteor.call('sendEmail',
        	    	managerEmailId,
			        fromEmail,
			        msg,
				    this._id,
				    subOfSubscribedDomain); 
	} 
   	else if (!(document.getElementById('pp').checked))
  	{
  		alert('pulling of data from managers collection');
    	alert('3');
  		var a =  Managers.findOne(this._id);
		var person =  a.categorySubscribedUsers;
		alert('4');
		if(person && person.length)
		{
			var j;
			alert('5');
			for(j= 0;j< person.length;j++)
			{
				alert('inside for loop');
				if(person[j].username === Meteor.user().username)
				{	
					
					var personId=person[j]._id;
					alert('person id '+person[j]._id);
					Managers.update(this._id,{$pull:{categorySubscribedUsers:{_id:personId}}});
					alert('user has been removed from managers colection');
					var msg = "Hello "+ managerName +",\n\n"+
   						userName + ' has unsubscribed from your category';
					var subOfUnSubscribedDomain = 'Notification of UnSubscribed Domain';
					Meteor.call('sendEmail',
        	    			managerEmailId,
			        		fromEmail,
			        		msg,
				    		this._id,
				    		subOfUnSubscribedDomain); 

		            break; 
				}
			}
   		
   		}
   	}
}

});
   
// For getting user specific subscribed issues
Template.subscribedKeyword.done = function () {
	alert('inside done function');
	var a =  Managers.findOne(this._id);
	var person =  a.categorySubscribedUsers;
	alert('before if block in done function');
	if(person && person.length)
	{
		var j;
		var ch='';

		alert('before loop in done function');
		for(j= 0;j< person.length;j++)
		{
			alert('j '+j);
			alert('person '+person[j].username);
			if(person[j].username === Meteor.user().username)
			{	
				ch ="checked";

				alert('value of ch that is set'+ch);
				break; 
			}
		}
		if(ch=== 'checked')
		{
			alert('while returning value in if block');
			return 'checked="checked"';
		}
		else		
		{
			alert('while returning value in else block');
			return '';
		}
		
	}
	else
		return '';

};   
