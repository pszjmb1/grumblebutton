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
 * For now publish all comment data
 */
Meteor.publish('comments', function() {
	return Comments.find();
});
