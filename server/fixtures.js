/**
 * Loads a set of structured data into the Grumble Button collections on the
 * first server start up.
 */

if (Issues.find().count() === 0) {

	Accounts.createUser({
  		'username'  : 'priya',
  		'password'  : '123456' //encrypted automatically 
	});

	Accounts.createUser({
  		'username'  : 'jatin',
  		'password'  : '123456' //encrypted automatically 
	});

	Accounts.createUser({
  		'username'  : 'sakshi',
  		'password'  : '123456' //encrypted automatically 
	});

	Accounts.createUser({
  		'username'  : 'tanuj',
  		'password'  : '123456' //encrypted automatically 
	});

	Accounts.createUser({
  		'username'  : 'vrinda',
  		'password'  : '123456' //encrypted automatically 
	});
	Accounts.createUser({
  		'username'  : 'priyank',
  		'password'  : '123456' //encrypted automatically 
	});
		
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

	var u4Id = Meteor.users.insert({
		profile: { name: 'priya' }
	});
	var u4 = Meteor.users.findOne(u4Id);

	var u5Id = Meteor.users.insert({
		profile: { name: 'tanuj' }
	});
	var u5 = Meteor.users.findOne(u5Id);

	var u6Id = Meteor.users.insert({
		profile: { name: 'priyank' }
	});
	var u6 = Meteor.users.findOne(u6Id);


	var u7Id = Meteor.users.insert({
		profile: { name: 'vrinda' }
	});
	var u7 = Meteor.users.findOne(u7Id);

	var u8Id = Meteor.users.insert({
		profile: { name: 'sakshi' }
	});
	var u8 = Meteor.users.findOne(u8Id);

	var u9Id = Meteor.users.insert({
		profile: { name: 'jatin' }
	});
	var u9 = Meteor.users.findOne(u9Id);
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
		anonymous: 'identifiable',
		userId: u9._id,
		author:'jatin',
		submitted: now - 3 * 3600 * 1000,
		subscribedUsers:[ ],
		commentsCount: 2,
	});  

	
	Comments.insert({
		issueId: issueId,
		userId: u2._id,
		author: u2.profile.name,
		submitted: now - 2 * 3600 * 1000,
		body: 'Maintenance has been alerted and these will be fixed this afternoon.'
	});
	Comments.insert({
		issueId: issueId,
		userId: u1._id,
		author: u1.profile.name,
		submitted: now - 1 * 3600 * 1000,
		body: 'Great!'
	});

	
	
/*	var issueId2 = Issues.insert({
		date: '01/01/2014',
		time: '14:23',
		dept: 'Lung Function',
		unit: 'North Entrance',
		room: 'N15',
		urgency: 'low',
		category: 'facilities',
		shortdesc: 'dirty toilet',
		details: 'Men\'s toilet 2 is dirty.',
		anonymous: 'identifiable',
		userId: u8._id,
		author: 'sakshi',
		submitted: now - 4 * 3600 * 1000,
		subscribedUsers:[ ],
		commentsCount: 0
	});

	var issueId3 = Issues.insert({
		date: '01/01/2014',
		time: '13:57',
		dept: 'Bone Densitometry',
		unit: 'Physiotherapy',
		room: 'P4',
		urgency: 'medium',
		category: 'Finance',
		shortdesc: 'Parking lot not free',

		details: 'Too crowded it is!',

		anonymous: 'identifiable',
		userId: u7._id,
		author: u7.profile.name,
		submitted: now - 3 * 3600 * 1000,
		subscribedUsers:[ ],
		commentsCount: 0,
	});

	var issueId4 = Issues.insert({
		date: '01/01/2014',
		time: '11:52',
		dept: 'Bone Densitometry',
		unit: 'Physiotherapy',
		room: 'P4',
		urgency: 'medium',
		category: 'Finance',
		shortdesc: 'Printer not working',
		details: 'I think problem is there in catridge',
		anonymous: 'identifiable',
		userId : u5._id,
		author : u5.profile.name,
		submitted : now - 3 * 3600 * 1000 ,
		subscribedUsers:[ ],
		commentsCount : 0,
	}); 
*/

	Managers.insert({
		name: 'Manager1',
		emailId: 'arora.priya4172@gmail.com',
		category: 'Finance' ,
		designation: 'Head',
		categorySubscribedUsers:[
			
		]
	});

	Managers.insert({
		name: 'Manager2',
		emailId: 'arora.priya4172@gmail.com',
		category: 'HR Dept' ,
		designation: 'Head',
		categorySubscribedUsers:[]
	});

	Managers.insert({
		name: 'Manager3',
		emailId: 'arora.priya4172@gmail.com',
		category: 'Lorum ipsum' ,
		designation: 'Head',
		categorySubscribedUsers:[]
	});

	Managers.insert({
		name: 'Manager4',
		emailId: 'arora.priya4172@gmail.com',
		category: 'utility' ,
		designation: 'Head',
		categorySubscribedUsers:[]
	});

	Managers.insert({
		name: 'Manager5',
		emailId: 'arora.priya4172@gmail.com',
		category: 'facilities' ,
		designation: 'Head',
		categorySubscribedUsers:[]
	}); 

	Managers.insert({
		name: 'Manager6',
		emailId: 'arora.priya4172@gmail.com',
		category: 'Managerial' ,
		designation: 'Head',
		categorySubscribedUsers:[]
	});
	/*ClosedIssues.insert({
		issueId:issueId
	});*/

/*	Issues.insert({
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
		subscribedUsers:[ ],
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
			subscribedUsers:[ ],
		         
			commentsCount: 0
		});
	} */
}




