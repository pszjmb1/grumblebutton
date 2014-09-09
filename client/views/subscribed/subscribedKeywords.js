//Template helper for SubscribedKeywords

// Form to add domain of user's choice
Template.subscribedKeywords.events({
	'submit form': function(e) {
		//alert('inside subscribedKeywords.js');
		e.preventDefault();
		var key = document.querySelector('[name=keyword]').value;
		document.querySelector('[name=keyword]').value = '';
		//alert('keyword '+key)
		if(key)
		{
			var subscriptionId = "";
			if(Subscribed.findOne({category: key})){
				subscriptionId = Subscribed.findOne({category: key})._id;
				Meteor.call('addNewSubcriber', subscriptionId, Meteor.userId());
				/*Subscribed.update({_id: subscriptionId}, {$push: {categorySubscribedUsers: Meteor.userId()}});*/
			}
			else{
				/*subscriptionId = Subscribed.insert({category:key});*/
				Meteor.call('createNewSubscription', key, function(error, result) {
					if(error){
						throwError(error.reason || "Unknown subscription creation error");
					} 
					else{
						Meteor.call('addNewSubcriber', result, Meteor.userId());
						/*Subscribed.update({_id: result}, {$push: {'categorySubscribedUsers': Meteor.userId()}});*/
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
			//limit: issuesHandle.limit()});
	}
	/*,
	// Determine if curent list of issues is ready
	issuesReady: function() {
		return !issuesHandle.loading();
	},
	// Determine if all issues have been loaded
	allIssuesLoaded: function() {
		return !issuesHandle.loading() &&
			Issues.find().count() < issuesHandle.loaded();
	}*/
});

// Handle the load more event
/*
Template.issues.events({
	'click .load-more': function(e) {
		e.preventDefault();
		issuesHandle.loadNextPage();
}
*/