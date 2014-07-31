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
	},
	openerName: function(){
		//getter for Notification openerName
		if(this.openerName !== undefined)
			return this.openerName;
		else
			return false;
	},
	subscribedUserName: function(){
		//getter for Notification subscribedUserName
		if(this.subscribedUserName !== undefined)
			return this.subscribedUserName;
		else
			return false;
	},
	unSubscribedUserName: function(){
		//getter for Notification unSubscribedUserName
		if(this.unSubscribedUserName !== undefined)
			return this.unSubscribedUserName;
		else
			return false;
	},
	postedUserName: function(){
		//getter for Notification postedUserName
		if(this.postedUserName !== undefined)
			return this.postedUserName;
		else
			return false;
	},
	closerName: function(){
		//getter for Notification closerName
		if(this.closerName !== undefined)
			return this.closerName;
		else
			return false;
	},
	commenterName: function(){
		//getter for Notification commenterName
		if(this.commenterName !== undefined)
			return this.commenterName;
		else
			return false;
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
