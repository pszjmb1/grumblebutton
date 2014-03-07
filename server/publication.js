/**
 * Grumble Button publication rules
 */

/**
 * Publish pagination limited number of issues
 */
Meteor.publish('newIssues', function(limit) {
	return Issues.find({}, {sort: {submitted: -1}, limit: limit});
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

// To notify using emailid
Meteor.publish('managers', function() {
	return Managers.find();
});

Meteor.publish('closedIssues', function() {
	return ClosedIssues.find();
});

