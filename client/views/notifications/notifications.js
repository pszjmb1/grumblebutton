Template.notifications.helpers({
notifications: function() {
	//alert('notifications for this user');
return Notifications.find({userId: Meteor.userId(), read: false});
},
notificationCount: function(){
	//alert('notificationCount for the logged in user'+ Notifications.find({userId: Meteor.userId(), read: false}).count());
return Notifications.find({userId: Meteor.userId(), read: false}).count();
}
});
Template.notification.events({
'click a': function() {
Notifications.update(this._id, {$set: {read: true}});
}
})

