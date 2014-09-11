/**
 * Helpers for rendering ClosedIssue detail pages.
 */

Template.closedIssuePage.helpers({
	currentClosedIssue: function() {
		return Issues.findOne(Session.get('currentClosedIssueId'));
	},
	comments: function() {
		return Comments.find({issueId: this._id});
	}
});
