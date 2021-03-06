/**
 * Grumble Button issues collection routines for client and server. Issues
 *	result from grumbling.
 */

Issues = new Meteor.Collection('issues');
/**
 * Server side function called by client to update Issues.
 */
Meteor.methods({
	toggleClosedSearch : function (id, status) {
		Issues.update(id, {$set: {closedIssueSearch: status}});
	},

	toggleOpenSearch : function (id, status) {
		Issues.update(id, {$set: {issueSearch: status}});
	},

	toggleIssueClosed : function (id, status) {
		Issues.update(id, {$set: {issueClosed: status}});
		Issues.update(id, {$set: {lastClosed: new Date().getTime()}});
	},

	grumble:function(grumbleAttribs) {
		var user = Meteor.user();
		// ensure the user is logged in
		if (!user)
			throw new Meteor.Error(401, "You need to login to grumble.");
		// ensure the grumble has correct field values
		if (!grumbleAttribs.details)
			throw new Meteor.Error(422, 'Please fill in the details.');
		if (!grumbleAttribs.date)
			throw new Meteor.Error(422, 'Please fill in the date.');
		if (!grumbleAttribs.time)
			throw new Meteor.Error(422, 'Please fill in the time.');
		if (!grumbleAttribs.location)
			throw new Meteor.Error(422, 'Please fill in the location.');
		if (!grumbleAttribs.anonymous)
			throw new Meteor.Error(422, 'Please fill in the anonymity requirement.');
		// Add additional rules ...
		var userName;

		if(grumbleAttribs.anonymous == "anonymous")
	    {
		  	userName = 'anonymous';	
	    }
		else
		{
		 	userName = Meteor.user().profile.addressing;
		}
		
		// pick out the whitelisted keys
		var issue = _.extend(
			_.pick(grumbleAttribs,
				'details','shortdesc','anonymous', 'date', 
				'time', 'device', 'location', 'ongoing'), 
				{
					userId: user._id,
					author: Meteor.user().profile.addressing,
					authorEmailId: user.emails[0].address,
					postedUser: userName,
					submitted: new Date().getTime(),
					// Field to know about closing of issue
					issueClosed :0,
					// Field to know about searching of the issue
					issueSearch:0,
					// Field to know about searching of closed issue
					closedIssueSearch:0,
					commentsCount: 0
				}
			);

		var issueId = Issues.insert(issue);
		return issueId;
	}
});
