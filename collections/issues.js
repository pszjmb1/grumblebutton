/**
 * Grumble Button issues collection routines for client and server. Issues
 *	result from grumbling.
 */

Issues = new Meteor.Collection('issues');

// only allow grumbling if you are logged in
Issues.allow({
	insert: function(userId, doc) {
		return !! userId;
	}
});
