/**
 * map URLs to specific templates in the {{renderPage}} helper
 */
Meteor.Router.add({
	'/': 'issues',
	'/issues': 'issues',
	'/closedIssues': 'closedIssues',
	'/subscribedKeywords': 'subscribedKeywords',
	'/issues/:_id': {
		to: 'issuePage',
		and: function(id) { Session.set('currentIssueId', id); }
	}, 
	/*
	'/fullIssue/:_id': {
		to: 'issuePage',
		and: function(id) { Session.set('currentIssueId', id); }
	},*/
	'/closedIssues/:_id': {
		to: 'closedIssuePage',
		and: function(id) { Session.set('currentClosedIssueId', id); }
	},
	'/grumble': 'grumble',
	'/grumble2': 'grumble2'
});

Meteor.Router.filters({
	'requireLogin': function(page) {
		if (Meteor.user())
			return page;
		else if (Meteor.loggingIn())
			return 'loading';
		else
			return 'accessDenied';
	},
	'clearErrors': function(page) {
		clearErrors();
		return page;
	}
});

Meteor.Router.filter('requireLogin', {only: 'grumble'});
Meteor.Router.filter('clearErrors');
