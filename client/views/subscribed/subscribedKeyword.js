
/**
*Template for handling the events of the keywords/domain
*/

Template.subscribedKeyword.events({
'click #check': function () {
	var senderEmail = 'grumblebutton@gmail.com';
	var userId = Meteor.userId();
	var userName = Meteor.user().profile.addressing;
   	var issueManagerCategory = Subscribed.findOne(this._id).category;
	var managerId = Subscribed.findOne({category: issueManagerCategory}).managerId;
	var id = Subscribed.findOne({category: issueManagerCategory})._id;
	// alert('this._id '+id);

	// Checking whether	the checkbox is checked or not
	// alert("$(this).prop('checked') "+$(this).prop('checked'));
	$('input[type="checkbox"]').on('change', function(e){
        if($(this).prop('checked'))
 	    {
            //$(this).next().val(1);
            // alert('$(this).next().val(1); '+$(this).next().val(1));
			// alert('inserting of data in subscribed collection'+Subscribed.findOne({category: issueManagerCategory}).category);
	
			// Adding the loggedin user to the collection on checking the checkbox
			Subscribed.update(id, {$addToSet: {categorySubscribedUsers : userId}});
			// alert('value added to the subscribed collection');
			var msg = "Hello,\n\n"+
    			userName + ' has subscribed to your category.'+'\n'+ "The link for the concerned issue is : http://localhost:15000/subscribedKeywords/";
    	
    		var subOfSubscribedDomain = 'Notification of Subscribed Domain';

    		// Mail to Manager
			// alert('mail to mgr regarding subscription by user of domain');
   			Meteor.call('sendEmail',
        	    	managerId,
			        senderEmail,
			        msg,
				    id,
				    subOfSubscribedDomain); 
        } else {

        	// If user wants to unsubscribe from the domain
            // alert('pulling of data from subscribed collection');
			// alert('id of the domain is '+id);
			var subscribedPersons = Subscribed.findOne({category: issueManagerCategory}).categorySubscribedUsers;
			// var subscribedPersons = id.categorySubscribedUsers;
			// alert(subscribedPersons.length);
			if(subscribedPersons && subscribedPersons.length)
			{
				var j;
				for(j= 0;j< subscribedPersons.length;j++)
				{
                    // alert('subscribedPersons[j].username '+subscribedPersons[j].username);
					if(subscribedPersons[j] === userId)
					{	
					
						var personId = subscribedPersons[j];
						// alert('personId '+personId);

						// Removin the username from domain list
						Subscribed.update(id,{$pull:{categorySubscribedUsers: personId}});
						// alert('data pulled from the subscribed collection');
						var msg = "Hello "+ managerName +",\n\n"+
   							userName + ' has unsubscribed from your category.'+'\n'+ "The link for the concerned issue is : http://localhost:3000/subscribedKeywords/";
						var subOfUnSubscribedDomain = 'Notification of UnSubscribed Domain';

						// Send mail to manager
						// alert('mail to mgr regarding unsubscription by user of domain');
						Meteor.call('sendEmail',
        	    			managerEmailId,
			        		senderEmail,
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
	// alert('inside done function');
	var subscribedUsersOfThisDomain = Subscribed.findOne(this._id);
	var subscribedPersons =  subscribedUsersOfThisDomain.categorySubscribedUsers;
	// alert('before if block in done function');
	if(subscribedPersons && subscribedPersons.length)
	{
		// alert('before loop in done function');
		for(var j = 0; j< subscribedPersons.length; j++)
		{
			//alert('j '+j);
			//alert('person '+person[j].username);
			if(subscribedPersons[j] == Meteor.userId())
			{
				// alert('value of ch that is set'+ch); 
				return "checked";
			}
		}
		
	}
	else
		return '';
};   
