//Template helper for SubscribedKeywords

// Form to add domain of user's choice
Template.subscribedKeywords.events({
	'submit form': function(e) 
	{
		e.preventDefault();
		var key = document.querySelector('[name=keyword]').value;
		document.querySelector('[name=keyword]').value = '';
		if(key)
		{
			var subscriptionId = "";
			if(Subscribed.findOne({category: key})){
				subscriptionId = Subscribed.findOne({category: key})._id;
				Meteor.call('addNewSubcriber', subscriptionId, Meteor.userId(), function(error) {
					if(error){
						throwError(error.reason || "Unknown error adding subscriber");
					}
				});
			}
			else{
				Meteor.call('createNewSubscription', key, function(error, result) {
					if(error){
						throwError(error.reason || "Unknown subscription creation error");
					} 
					else{
						Meteor.call('addNewSubcriber', result, Meteor.userId(), function(error) {
							if(error){
								throwError(error.reason || "Unknown error adding subscriber");
							}
						});
					}
				});
			}
		}

	}
});

// Showing all the keywords present in the collection
Template.subscribedKeywords.helpers({
	subscribedKeywords: function() {
		return Subscribed.find({categorySubscribedUsers: Meteor.userId()});
	}
});
