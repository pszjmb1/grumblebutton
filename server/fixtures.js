/**
 * Loads a set of structured data into the Grumble Button collections on the
 * first server start up.
 */

if (Issues.find().count() === 0) {
	var now = new Date().getTime();

	// Example users
	var u1Id = Meteor.users.insert({
		profile: { name: 'abc123' }
	});
	var u1 = Meteor.users.findOne(u1Id);
	var u2Id = Meteor.users.insert({
		profile: { name: 'def456' }
	});
	var u2 = Meteor.users.findOne(u2Id);
	var u3Id = Meteor.users.insert({
		profile: { name: 'ghi789' }
	});
	var u3 = Meteor.users.findOne(u3Id);

	// Example issues and comments
	var issueId = Issues.insert({
		date: '01/01/2014',
		time: '11:52',
		dept: 'Bone Densitometry',
		unit: 'Physiotherapy',
		room: 'P4',
		urgency: 'medium',
		category: 'utility',
		shortdesc: 'temperature too cold',
		details: 'Three of the radiators don\'t seem to be working.',
		anonymous: 1,
		user: u1._id,
		submitted: now - 3 * 3600 * 1000,
		commentsCount: 2,
	});
	Comments.insert({
		issueId: issueId,
		userId: u2._id,
		submitted: now - 2 * 3600 * 1000,
		body: 'Maintenance has been alerted and these will be fixed this afternoon.'
	});
	Comments.insert({
		issueId: issueId,
		userId: u1._id,
		submitted: now - 1 * 3600 * 1000,
		body: 'Great!'
	});

	Issues.insert({
		date: '01/01/2014',
		time: '14:23',
		dept: 'Lung Function',
		unit: 'North Entrance',
		room: 'N15',
		urgency: 'low',
		category: 'facilities',
		shortdesc: 'dirty toilet',
		details: 'Men\'s toilet 2 is dirty.',
		anonymous: 1,
		user: u3._id,
		submitted: now - 4 * 3600 * 1000,
		commentsCount: 0
	});

	Issues.insert({
		date: '01/01/2014',
		time: '19:53',
		dept: 'Urology Centre',
		room: 'N1a',
		urgency: 'high',
		category: 'utility',
		shortdesc: 'missing equipment',
		details: 'Cabinet 3 needs restocking.',
		anonymous: 1,
		user: u1._id,
		submitted: now - 6 * 3600 * 1000,
		commentsCount: 0,
		closed: now - 5 * 3600 * 1000,
		closer: u2._id
	});

	for (var i = 3; i < 100; i++) {
		Issues.insert({
			date: '01/01/2014',
			time: '19:53',
			dept: 'Lorem ipsum',
			room: i,
			urgency: 'high',
			category: 'Lorem ipsum',
			shortdesc: 'test issue ' + i,
			details: 'Lorem ipsum.',
			anonymous: 1,
			user: u1._id,
			submitted: now - i -7 * 3600 * 1000,
			commentsCount: 0
		});
	}
}
