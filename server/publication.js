/**
 * Grumble Button publication rules
 */

/**
 * For now publish all issue data
 */
Meteor.publish('issues', function() {
	return Issues.find();
});

/**
 * Publish comment data for the relevant issue
 */
Meteor.publish('comments', function(issueId) {
	return Comments.find({issueId: issueId});
});
