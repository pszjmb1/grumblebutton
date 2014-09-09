Subscribed = new Meteor.Collection('subscribed');

Meteor.methods({
	markFound: function (id) {
		Subscribed.update(id, {$set: {found: 0}});
	},

	markUnfound : function (id) {
		Subscribed.update(id, {$set: {found: 1}});
	},

	createNewSubscription: function (key) {
		return Subscribed.insert({category:key});
	},

	addNewSubcriber : function (subscription, userId) {
		Subscribed.update({_id : subscription}, {$addToSet: {categorySubscribedUsers : userId}});
	},

	removeSubsciber : function (subscription, userId) {
		Subscribed.update(subscription,{$pull:{categorySubscribedUsers: userId}});
	}
});