/**
 * Grumble Button publication rules
 */

/**
 * Publish pagination limited number of issues
 */
Meteor.publish('newOpenIssues', function(limit) {
  if(this.userId)
    return Issues.find({issueClosed: 0}, {sort: {submitted: -1}, limit: limit, fields: {'author':0, 'authorEmailId':0, 'device':0, 'submitted': 0}});
  else
    this.ready();
});

Meteor.publish('newClosedIssues', function(limit) {
  if(this.userId)
    return Issues.find({issueClosed: 1}, {sort: {submitted: -1}, limit: limit, fields: {'author':0, 'authorEmailId':0, 'device':0, 'submitted': 0}});
  else
    this.ready();
});

Meteor.publish('notifications', function(limit) {
  if(this.userId)
    return Notifications.find({userId: this.userId}, {sort: {timestamp: -1}, limit: limit});
  else
    this.ready();
});

Meteor.publish('singleIssue', function(id) {
  if(this.userId)
  	return id && Issues.find(id);
  else
    this.ready();
});


/**
 * Publish comment data for the relevant issue
 */
Meteor.publish('comments', function(issueId) {
  if(this.userId)
  	return Comments.find({issueId: issueId});
  else
    this.ready();
});

Meteor.publish('subscribed', function() {
  if(this.userId)
  	return Subscribed.find();
  else
    this.ready()
});

Meteor.publish("users", function () {
  if (this.userId) {
    return Meteor.users.find({_id: this.userId},
        {fields: {'notified': 1}});
  } else {
    this.ready();
  }
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






