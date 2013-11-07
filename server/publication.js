/**
 * Grumble Button publication rules
 */

/**
 * For now publish all issue data
 */
Meteor.publish('issues', function() {
	return Issues.find();
});
