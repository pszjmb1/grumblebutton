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

Template.notification.helpers({
	getUser: function(name){
		if(name == Meteor.user().username){
			return "You";
		}
		else{
			return name;
		}
	},
	displayDate: function(date){
		var currentDate = new Date();
		var dateString = "";
		if(date.getFullYear() == currentDate.getFullYear()){
			if(date.getMonth() == currentDate.getMonth()){
				if(date.getDate() == currentDate.getDate()){
					if(date.getHours() == currentDate.getHours){
						if(date.getMinutes() == currentDate.getMinutes())
							dateString = "Just now";
						else
							dateString = "About " + (currentDate.getMinutes() - date.getMinutes()) + " minute(s) ago";
					}
					else
						dateString = "About " + (currentDate.getHours() - date.getHours()) + " hour(s) ago";
				}
				else
					dateString = (currentDate.getDate() - date.getDate()) + " day(s) ago";
			}
			else
				dateString = (currentDate.getMonth() - date.getMonth()) + " month(s) ago";
		}
		else
			dateString = (currentDate.getFullYear() - date.getFullYear()) + " year(s) ago";
		return dateString;
	}
});

// Default mark all notifications to be read on clicking the 'mark all' link
Template.notification.events({
	'click a': function() {
		Notifications.update(this._id, {$set: {read: true}});
	}
});

// Default mark all notifications to be read on clicking the 'mark all' link
Template.notifications.events({
	'click .marked': function(e) {
		e.preventDefault();
		//var i;
		//var count=Notifications.find().count();
		
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


Template.notificationsPage.helpers({
	NotificationList: function(){
		return (Notifications.find({userId: Meteor.userId()}, {sort: {timestamp: -1}}));
	}
});