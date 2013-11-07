/**
 * map URLs to specific templates in the {{renderPage}} helper
 */
Meteor.Router.add({
	'/': 'issues',
	'/issues/:_id': {
		to: 'issuePage',
		and: function(id) { Session.set('currentIssueId', id); }
	},
	'/grumble': 'grumble'
});

Meteor.Router.filters({
	'requireLogin': function(page) {
		if (Meteor.user())
			return page;
		else
			return 'accessDenied';
	}
});

Meteor.Router.filter('requireLogin', {only: 'grumble'});
