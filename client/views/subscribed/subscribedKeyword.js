
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
		
		// Checking whether	the checkbox is checked or not
		$('input[type="checkbox"]').on('change', function(e)
		{
			if($(this).prop('checked'))
			{
				// Adding the loggedin user to the collection on checking the checkbox
				Meteor.call('addNewSubcriber', id, userId, function(error) {
					if(error){
						throwError(error.reason || "Unknown error adding new subscriber");
					}
				});
				var msg = "Hello,\n\n"+
					userName + ' has subscribed to your category.'+'\n'+ "The link for the concerned issue is : http://localhost:15000/subscribedKeywords/";

				var subOfSubscribedDomain = 'Notification of Subscribed Domain';

				// Mail to Manager
				Meteor.call('sendEmail',
					managerId,
					senderEmail,
					msg,
					id,
					subOfSubscribedDomain, function(error) {
						if(error){
							throwError(error.reason || "Unknown error sending email");
						}
					}); 
			} 
			else {
				// If user wants to unsubscribe from the domain
				// Removing the user from domain list
				Meteor.call('removeSubscriber', id, userId, function(error) {
					if(error){
						throwError(error.reason || "Unknown error removing subscriber");
					}
				});
				
				var msg = "Hello "+ managerName +",\n\n"+
					userName + ' has unsubscribed from your category.'+'\n'+ "The link for the concerned issue is : http://localhost:3000/subscribedKeywords/";
				var subOfUnSubscribedDomain = 'Notification of UnSubscribed Domain';

				// Send mail to manager
				Meteor.call('sendEmail',
					managerEmailId,
					senderEmail,
					msg,
					id,
					subOfUnSubscribedDomain, function(error) {
						if(error){
							throwError(error.reason || "Unknown error sending email");
						}
					}); 
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
