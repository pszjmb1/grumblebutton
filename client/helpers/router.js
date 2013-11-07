/**
 * map URLs to specific templates in the {{renderPage}} helper
 */
Meteor.Router.add({
	'/': 'issues',
	'/issues/:_id': {
		to: 'issuePage',
		and: function(id) { Session.set('currentIssueId', id); }
	}
});
