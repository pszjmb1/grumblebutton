/**
 * Grumble Button issues collection routines for client and server. Issues
 *	result from grumbling.
 */

Issues = new Meteor.Collection('issues');
/**
 * Server side function called by client to update Issues.
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
		//if (!grumbleAttribs.category)
		//	throw new Meteor.Error(422, 'Please fill in the category.');	
		//if (!grumbleAttribs.date)
		//	throw new Meteor.Error(422, 'Please fill in the date.');
		//if (!grumbleAttribs.time)
		//	throw new Meteor.Error(422, 'Please fill in the time.');
		//  if (!grumbleAttribs.dept)
		//	throw new Meteor.Error(422, 'Please fill in the department.');
		//if (!grumbleAttribs.unit)
		//	throw new Meteor.Error(422, 'Please fill in the unit.');
		//if (!grumbleAttribs.room)
		//	throw new Meteor.Error(422, 'Please fill in the room.');
		//if (!grumbleAttribs.urgency)
		//	throw new Meteor.Error(422, 'Please fill in the urgency.');
		  
		//if (!grumbleAttribs.subcategory)
		//	throw new Meteor.Error(422, 'Please fill in the subcategory.');
		  if (!grumbleAttribs.anonymous)
			throw new Meteor.Error(422, 'Please fill in the anonymity requirement.');
		// Add additional rules ...
		var userName;

		if(grumbleAttribs.anonymous == "anonymous")
	    {
		  	userName = 'anonymous';	
		  	userPosted = user.username;
		  	userEmailId = user.emails[0].address;

	    }
		else
		{
		 	userName = user.username;
		 	userPosted = user.username;
		 	userEmailId = user.emails[0].address;
		}
		
		// pick out the whitelisted keys
		var issue = _.extend(
			_.pick(grumbleAttribs,
			'shortdesc','anonymous', 'date', 'time', 'device'
			/*'dept',
			'unit', 'room', 'urgency',
			'category',  'details', */
			), {
					userId: user._id,
					author: userName,
					authorEmailId: userEmailId,
					postedUser:userPosted,
					submitted: new Date().getTime(),
					// Field to know about closing of issue
					issueClosed :0,
					// Field to know about searching of the issue
					issueSearch:0,
					// Field to know about searching of closed issue
					closedIssueSearch:0,
					commentsCount: 0
		});

		var issueId = Issues.insert(issue);
		return issueId;
	}
});
