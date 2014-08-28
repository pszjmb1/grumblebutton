/**
 * Grumble Button publication rules
 */

/**
 * Publish pagination limited number of issues
 */


Meteor.publish('newOpenIssues', function(limit) {
	return Issues.find({issueClosed: 0}, {sort: {submitted: -1}, limit: limit});
});

Meteor.publish('newClosedIssues', function(limit) {
  return Issues.find({issueClosed: 1}, {sort: {submitted: -1}, limit: limit});
});

Meteor.publish('singleIssue', function(id) {
	return id && Issues.find(id);
});


/**
 * Publish comment data for the relevant issue
 */
Meteor.publish('comments', function(issueId) {
	return Comments.find({issueId: issueId});
});

Meteor.publish('notifications', function() {
	return Notifications.find({userId: this.userId});
});

Meteor.publish('subscribed', function() {
	return Subscribed.find();
});


/*Meteor.publish('users', function() {
    return Meteor.users.find({}, {fields: {notified: 0}});
}); */

/*
Meteor.publish(null, function () {
  	var fields = {
        notified:0
      }

  return Meteor.users.find({}, {fields: fields})
}); */

Meteor.publish("users", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId},
        {fields: {'notified': 1}});
  } else {
    this.ready();
  }
});





