
Template.subscribedKeyword.events({
'click #pp': function () {

	
	var fromEmail = 'grumblebutton@gmail.com';
	var userId = Meteor.user();
	var userName = userId.username;
   	var issueManagerCategory = Managers.findOne(this._id).category;
	var managerEmailId = Managers.findOne({category: issueManagerCategory}).emailId;
	var managerName = Managers.findOne({category: issueManagerCategory}).name;
	var id = Managers.findOne({category: issueManagerCategory})._id;
			alert('this._id '+id);
	
	$('input[type="checkbox"]').on('change', function(e){
        if($(this).prop('checked'))
        {
            $(this).next().val(1);
    //    	alert('inserting of data in managers collection');
	
			Managers.update(id, {$addToSet: {categorySubscribedUsers : Meteor.user()}});
			var msg = "Hello "+ managerName +",\n\n"+
    			userName + ' has subscribed to your category';
    	
    		var subOfSubscribedDomain = 'Notification of Subscribed Domain';
   			Meteor.call('sendEmail',
        	    	managerEmailId,
			        fromEmail,
			        msg,
				    id,
				    subOfSubscribedDomain); 
        } else {
            $(this).next().val(0);
    //    	alert('pulling of data from managers collection');

  			var a =  Managers.findOne(this._id);
			var person =  a.categorySubscribedUsers;
			if(person && person.length)
			{
				var j;

				for(j= 0;j< person.length;j++)
				{
					if(person[j].username === Meteor.user().username)
					{	
					
						var personId=person[j]._id;
						Managers.update(id,{$pull:{categorySubscribedUsers:{_id:personId}}});
						var msg = "Hello "+ managerName +",\n\n"+
   							userName + ' has unsubscribed from your category';
						var subOfUnSubscribedDomain = 'Notification of UnSubscribed Domain';
						Meteor.call('sendEmail',
        	    			managerEmailId,
			        		fromEmail,
			        		msg,
				    		id,
				    		subOfUnSubscribedDomain); 

			            break; 
					}
				}
   		
   			}
        }
	});
}

});
   
// For getting user specific subscribed issues
Template.subscribedKeyword.done = function () {
	//alert('inside done function');
	var a =  Managers.findOne(this._id);
	var person =  a.categorySubscribedUsers;
	//alert('before if block in done function');
	if(person && person.length)
	{
		var j;
		var ch='';

	//	alert('before loop in done function');
		for(j= 0;j< person.length;j++)
		{
		//	alert('j '+j);
			//alert('person '+person[j].username);
			if(person[j].username === Meteor.user().username)
			{	
				ch ="checked";

		//		alert('value of ch that is set'+ch);
				break; 
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
		
	}
	else
		return '';

};   
