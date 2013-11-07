/**
 * Helpers for rendering Issue detail pages.
 */

Template.issuePage.helpers({
	currentIssue: function() {
		return Issues.findOne(Session.get('currentIssueId'));
	}
});
