/**
 * Loads a set of structured data into the Grumble Button collections on the
 * first server start up.
 */

if (Issues.find().count() === 0) {
	Accounts.onCreateUser(function (options, user) {
  		if (options.profile) {
    		//want the users facebook pic and it is not provided by the facebook.service
    		user.profile = options.profile;
    		user.notified = false;
  		}
    	return user;
	});
	Accounts.createUser({
		'password'  : '123456', //encrypted automatically 
		'email'    : 'priya@gmail.com'
	});
	var priya = Meteor.users.findOne({'emails.address' : 'priya@gmail.com'});

	Accounts.createUser({
		'password'  : '123456', //encrypted automatically 
		'email'     : 'jatin@gmail.com'
	});
	var jatin = Meteor.users.findOne({'emails.address' : 'jatin@gmail.com'});

	Accounts.createUser({
		'password'  : '123456', //encrypted automatically 
		'email'     : 'sakshi@gmail.com'
	});
	var sakshi = Meteor.users.findOne({'emails.address' : 'sakshi@gmail.com'});

	Accounts.createUser({
		'password'  : '123456', //encrypted automatically 
		'email'     : 'tanuj@gmail.com'
	});
	var tanuj = Meteor.users.findOne({'emails.address' : 'tanuj@gmail.com'});

	Accounts.createUser({
		'password'  : '123456', //encrypted automatically 
		'email'     : 'vrinda@gmail.com'
	});
	Accounts.createUser({
		'password'  : '123456', //encrypted automatically 
		'email'     : 'priyank@gmail.com'
	});

	var now = new Date().getTime();

	// Example issues and comments
	var issueId = Issues.insert({
		date: '01/01/2014',
		time: '11:52',
		location: 'Bone Densitometry, Physiotherapy, P4',
		shortdesc: 'Three of the radiators don\'t seem to be working',
		details: 'Three of the radiators don\'t seem to be working.',
		anonymous: 'identifiable',
		userId: jatin._id,
		postedUser:'jatin',
		submitted: now - 3 * 3600 * 1000,
		issueClosed:0,
		issueSearch:0,
		closedIssueSearch:0,
		device: "Mozilla/5.0 (Windows NT 6.1; WOW64l rv:25.0) Gecko/20100101 Firefox/25.0",
		commentsCount: 2,
	});


	Comments.insert({
		action: "fix",
		author: priya.profile.addressing,
		body: 'Maintenance has been alerted and these will be fixed this afternoon.',
		issueId: issueId,
		submitted: now - 2 * 3600 * 1000,
		userId: priya._id
	});
	Comments.insert({
		action: "clarify",
		author: jatin.profile.addressing,
		body: 'Great!',
		issueId: issueId,
		submitted: now - 1 * 3600 * 1000,
		userId: jatin._id
	});

	var issueId2 = Issues.insert({
		date: '01/01/2014',
		time: '14:23',
		location: 'Lung Function, North Entrance, N15',
		shortdesc: 'Men\'s toilet 2 is dirty',
		details: 'Men\'s toilet 2 is dirty.',
		anonymous: 'identifiable',
		userId: sakshi._id,
		postedUser: 'sakshi',
		submitted: now - 4 * 3600 * 1000,
		issueClosed:0,
		issueSearch:0,
		subscribedUsers:[ ],
		device: "Mozilla/5.0 (Windows NT 6.1; WOW64l rv:25.0) Gecko/20100101 Firefox/25.0",
		commentsCount: 0
	});

	var issueId3 = Issues.insert({
		date: '01/01/2014',
		time: '13:57',
		location: 'City Hospital, Car park',
		shortdesc: 'Parking lot not free',
		details: 'Parking lot not free',
		anonymous: 'identifiable',
		userId: sakshi._id,
		postedUser: "sakshi",
		submitted: now - 3 * 3600 * 1000,
		issueClosed:0,
		issueSearch:0,
		subscribedUsers:[ ],
		device: "Mozilla/5.0 (Windows NT 6.1; WOW64l rv:25.0) Gecko/20100101 Firefox/25.0",
		commentsCount: 0,
	});

	var issueId4 = Issues.insert({
		date: '01/01/2014',
		time: '11:52',
		dept: 'City Hospital, Reception',
		shortdesc: 'Printer not working',
		details: 'Printer not working. I think problem is there in catridge',
		anonymous: 'identifiable',
		userId : priya._id,
		postedUser : "priya",
		submitted : now - 3 * 3600 * 1000 ,
		issueClosed:0,
		issueSearch:0,
		closedIssueSearch:0,
		subscribedUsers:[ ],
		device: "Mozilla/5.0 (Windows NT 6.1; WOW64l rv:25.0) Gecko/20100101 Firefox/25.0",
		commentsCount : 0,
	});  

	Subscribed.insert({
		managerId: Meteor.users.findOne({'emails.address': "priya@gmail.com"})._id,
		category: 'Finance',
		done: false,
		categorySubscribedUsers:[
			tanuj._id,		
		]
	});

	Subscribed.insert({
		managerId: Meteor.users.findOne({'emails.address': "priya@gmail.com"})._id,
		category: 'HR Dept',
		done:false,
		categorySubscribedUsers:[]
	});

	Subscribed.insert({
		managerId: Meteor.users.findOne({'emails.address': "priya@gmail.com"})._id,
		category: 'Building',
		done:false,
		categorySubscribedUsers:[]
	});

	Subscribed.insert({
		managerId: Meteor.users.findOne({'emails.address': "priya@gmail.com"})._id,
		category: 'utility',
		done:'false',
		categorySubscribedUsers:[]
	});

	Subscribed.insert({
		managerId: Meteor.users.findOne({'emails.address': "priya@gmail.com"})._id,
		category: 'facilities',
		done:'false',
		categorySubscribedUsers:[]
	}); 

	Subscribed.insert({
		managerId: Meteor.users.findOne({'emails.address': "priya@gmail.com"})._id,
		category: 'Managerial',
		done:'false',
		categorySubscribedUsers:[]
	});

	Issues.insert({
		date: '01/01/2014',
		time: '19:53',
		location: 'King\'s Meadow, Urology Centre, N1a',
		shortdesc: 'Cabinet 3 needs restocking',
		details: 'Cabinet 3 needs restocking.',
		anonymous: 'anonymous',
		postedUser: 'anonymous',
		user: priya._id,
		submitted: now - 6 * 3600 * 1000,
		commentsCount: 0,
		issueClosed:1,
		issueSearch:0,
		subscribedUsers:[ ],
		device: "Mozilla/5.0 (Windows NT 6.1; WOW64l rv:25.0) Gecko/20100101 Firefox/25.0",
	});

	Notifications.insert({
		userId: priya._id,
		issueId: Issues.findOne()._id,   
		subscribedUserId: tanuj._id,
		subscribedUserName: "tanuj",
		read: false,
		timestamp: new Date()
	});
	Notifications.insert({
		userId: priya._id,
		issueId: Issues.findOne()._id,
		openerId: jatin._id,
		openerName: "jatin",
		read: false,
		timestamp: new Date()
	});
	Notifications.insert({
		userId: priya._id,
		issueId: Issues.findOne()._id,
		unSubscribedUserId: jatin._id,
		unSubscribedUserName: "jatin",
		read: false,
		timestamp: new Date()
	});
	Notifications.insert({
		userId: priya._id,
		issueId: Issues.findOne()._id,
		postedUserId: sakshi._id,
		postedUserName: "sakshi",
		read: false,
		timestamp: new Date()
	});
	Notifications.insert({
		userId: sakshi._id,
		issueId: Issues.findOne()._id,
		closerId: priya._id,
		closerName: "priya",
		read: false,
		timestamp: new Date()
	});
	Notifications.insert({
		userId: jatin._id,
		issueId: Issues.findOne()._id,
		commenterId: sakshi._id,
		commenterName: "sakshi",
		read: false,
		timestamp: new Date()
	})
}