/**
*Template for dealing with all the notifications
*/

Template.notifications.helpers({
	notifications: function() {
		return Notifications.find({userId: Meteor.userId(), read: false});
	},
	notificationCount: function(){
		return Notifications.find({userId: Meteor.userId(), read: false}).count();
	}
});

Template.notification.helpers({
	getUser: function(id, name){
		if(id == Meteor.userId()){
			return "You";
		}
		else{
			return name;
		}
	},
	displayDate: function(date){
		var currentDate = new Date();
		var dateString = "";
		if((currentDate.getFullYear() - date.getFullYear()) < 1){
			if((currentDate.getMonth() - date.getMonth()) < 1){
				if((currentDate.getDate() - date.getDate()) < 1){
					if((currentDate.getHours() - date.getHours()) < 1){
						if((currentDate.getMinutes() - date.getMinutes()) < 1)
							dateString = "Just now";
						else
							dateString = "About " + (currentDate.getMinutes() - date.getMinutes()) + " minute(s) ago";
					}
					else
						dateString = "About " + (currentDate.getHours() - date.getHours()) + " hour(s) ago";
				}
				else
					dateString = "About " + (currentDate.getDate() - date.getDate()) + " day(s) ago";
			}
			else
				dateString = "About " + (currentDate.getMonth() - date.getMonth()) + " month(s) ago";
		}
		else {
			dateString = "About " + (currentDate.getFullYear() - date.getFullYear()) + " year(s) ago";
		}
		return dateString;
	}
});

// Default mark all notifications to be read on clicking the 'mark all' link
Template.notification.events({
	'click a': function() {
		Meteor.call('setReadNotification', this._id);
	}
});

// Default mark all notifications to be read on clicking the 'mark all' link
Template.notifications.events({
	'click .marked': function(e) {
		e.preventDefault();		
		var notices = Notifications.find();
		notices.forEach( function(myDoc) {
			if(myDoc.userId === Meteor.userId())
			{
				Meteor.call('setReadNotification', myDoc._id);
			}
		});
	}
}); 


Template.notificationsPage.helpers({
	NotificationList: function(){
		return (Notifications.find({userId: Meteor.userId()}, {sort: {timestamp: -1}}));
	}
});