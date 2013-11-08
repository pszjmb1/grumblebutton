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
	return id && Posts.find(id);
});

/**
 * Publish comment data for the relevant issue
 */
Meteor.publish('comments', function(issueId) {
	return Comments.find({issueId: issueId});
});
