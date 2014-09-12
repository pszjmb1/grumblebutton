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
		var yearDiff = Math.floor((((currentDate.getFullYear() * 12) + currentDate.getMonth()) - ((date.getFullYear() * 12) + date.getMonth())) / 12);
		if(yearDiff < 1){
			var monthDiff;
			if(currentDate.getMonth() < date.getMonth())
				monthDiff = Math.floor(((((currentDate.getMonth() + 12) * getNumberOfDays(currentDate.getFullYear(), currentDate.getMonth())) + currentDate.getDate()) - ((date.getMonth() * getNumberOfDays(date.getFullYear(), date.getMonth())) + date.getDate())) / 28);
			else
				monthDiff = Math.floor((((currentDate.getMonth() * getNumberOfDays(currentDate.getFullYear(), currentDate.getMonth())) + currentDate.getDate()) - ((date.getMonth() * getNumberOfDays(date.getFullYear(), date.getMonth())) + date.getDate())) / 28);
			if(monthDiff < 1){
				var dayDiff;
				if(currentDate.getDate() < date.getDate())
					dayDiff = Math.floor(((((currentDate.getDate() + getNumberOfDays(currentDate.getFullYear(), currentDate.getMonth())) * 24) + currentDate.getHours()) - ((date.getDate() * 24) + date.getHours())) / 24);
				else
					dayDiff = Math.floor((((currentDate.getDate() * 24) + currentDate.getHours()) - ((date.getDate() * 24) + date.getHours())) / 24); 
				if(dayDiff < 1){
					var hourDiff;
					if(currentDate.getHours() < date.getHours())
						hourDiff = Math.floor(((((currentDate.getHours() + 24) * 60) + currentDate.getMinutes()) - ((date.getHours() * 60) + date.getMinutes())) / 60);
					else
						hourDiff = Math.floor((((currentDate.getHours() * 60) + currentDate.getMinutes()) - ((date.getHours() * 60) + date.getMinutes())) / 60);
					if(hourDiff < 1){
						var minuteDiff;
						if(currentDate.getMinutes() < date.getMinutes())
							minuteDiff = Math.floor(((((currentDate.getMinutes() + 60) * 60) + currentDate.getSeconds()) - ((date.getMinutes() * 60) + date.getSeconds())) / 60);
						else
							minuteDiff = Math.floor((((currentDate.getMinutes() * 60) + currentDate.getSeconds()) - ((date.getMinutes() * 60) + date.getSeconds())) / 60);
						if(minuteDiff < 1){
							dateString = "Just now";
						}
						else if(minuteDiff == 1){	
							dateString = "About 1 minute ago";
						}
						else{
							dateString = "About " + minuteDiff + " minutes ago";
						}
					}
					else if(hourDiff == 1){
						dateString = "About 1 hour ago";
					}
					else{
						dateString = "About " + hourDiff + " hours ago";
					}
				}
				else if(dayDiff == 1){
					dateString = "About 1 day ago";
				}
				else{
					dateString = "About " + dayDiff + " days ago";
				}
			}
			else if(monthDiff == 1){
				dateString = "About 1 month ago";
			}
			else{
				dateString = "About " + monthDiff + " months ago";
			}
		}
		else if(yearDiff == 1){
			dateString = "About 1 year ago";
		}
		else{
			dateString = "About " + yearDiff + " year(s) ago";
		}
		return dateString;
	}
});

// Default mark all notifications to be read on clicking the 'mark all' link
Template.notification.events({
	'click a': function() {
		Meteor.call('setReadNotification', this._id, function(error) {
			if(error)
			{
				throwError(error.reason || "Unknown error setting notification to read");
			}
		});
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
	},
	// Determine if curent list of issues is ready
	notificationsReady: function() {
		return !notificationHandle.loading();
	},
	// Determine if all issues have been loaded
	allNotificationsLoaded: function() {
		return !notificationHandle.loading() &&
			Notifications.find().count() < notificationHandle.loaded();
	}
});

// Handle the load more event
Template.notificationsPage.events({
	'click .load-more': function(e) {
		e.preventDefault();
		notificationHandle.loadNextPage();
	}
});

var getNumberOfDays = function(year, month) {
	var isLeap = ((year % 4) == 0 && ((year % 100) != 0 || (year % 400) == 0));
	return [31, (isLeap ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][month];
}