/**
 * Grumble Button issues collection routines for client and server. Issues
 *	result from grumbling.
 */

Issues = new Meteor.Collection('issues');

/**
 * Server side function called by client to update the collection.
 */
Meteor.methods({
	grumble:function(grumbleAttribs) {
		var user = Meteor.user();
		// ensure the user is logged in
		if (!user)
			throw new Meteor.Error(401, "You need to login to grumble.");
		// ensure the grumble has correct field values
		if (!grumbleAttribs.shortdesc)
			throw new Meteor.Error(422, 'Please fill in the short description.');
		if (!grumbleAttribs.date)
			throw new Meteor.Error(422, 'Please fill in the date.');
		if (!grumbleAttribs.time)
			throw new Meteor.Error(422, 'Please fill in the time.');
		if (!grumbleAttribs.dept)
			throw new Meteor.Error(422, 'Please fill in the department.');
		if (!grumbleAttribs.unit)
			throw new Meteor.Error(422, 'Please fill in the unit.');
		if (!grumbleAttribs.room)
			throw new Meteor.Error(422, 'Please fill in the room.');
		if (!grumbleAttribs.urgency)
			throw new Meteor.Error(422, 'Please fill in the urgency.');
		if (!grumbleAttribs.category)
			throw new Meteor.Error(422, 'Please fill in the category.');
		if (!grumbleAttribs.subcategory)
			throw new Meteor.Error(422, 'Please fill in the subcategory.');
		if (!grumbleAttribs.anonymous)
			throw new Meteor.Error(422, 'Please fill in the anonymity requirement.');
		// Add additional rules ...

		// pick out the whitelisted keys
		var issue = _.extend(
			_.pick(grumbleAttribs,
			'date', 'time', 'dept',
			'unit', 'room', 'urgency',
			'category', 'subcategory', 'shortdesc', 'anonymous'
			), {
					userId: user._id,
					submitted: new Date().getTime()
		});

		var issueId = Issues.insert(issue);
		return issueId;
	}
});
