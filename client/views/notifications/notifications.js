/**
*Template for dealing with all the notifications
*/

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
});

Template.notifications.events({
	'click .marked': function(e) {
		e.preventDefault();
		var i;
		var count=Notifications.find().count();
		
		var notices = Notifications.find();
		notices.forEach( function(myDoc) {
			//alert('myDoc._id '+myDoc._id);
			if(myDoc.userId === Meteor.user()._id)
			{
				Notifications.update(myDoc._id, {$set: {read: true}});
			}
		});
	}
}); 
