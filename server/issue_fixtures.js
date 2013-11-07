/**
 * Loads a set of structured data into the Issues collection on the first
 *	server start up.
 */

if (Issues.find().count() === 0) {
	Issues.insert({
		date: '01/01/2014',
		time: '11:52',
		dept: 'Bone Densitometry',
		unit: 'Physiotherapy',
		room: 'P4',
		urgency: 'medium',
		category: 'utility',
		subcategory: 'heating',
		shortdesc: 'temperature too cold',
		details: 'Three of the radiators don\'t seem to be working.',
		anonymous: 1,
		user: '00002368'
	});

	Issues.insert({
		date: '01/01/2014',
		time: '14:23',
		dept: 'Lung Function',
		unit: 'North Entrance',
		room: 'N15',
		urgency: 'low',
		category: 'facilities',
		subcategory: 'cleaning',
		shortdesc: 'dirty toilet',
		details: 'Men\'s toilet 2 is dirty.',
		anonymous: 1,
		user: '00003351'
	});

	Issues.insert({
		date: '01/01/2014',
		time: '19:53',
		dept: 'Urology Centre',
		room: 'N1a',
		urgency: 'high',
		category: 'utility',
		subcategory: 'equipment',
		shortdesc: 'missing equipment',
		details: 'Cabinet 3 needs restocking.',
		anonymous: 1,
		user: '00008363'
	});
}
