/**
 * Helpers for rendering ClosedIssue detail pages.
 */

Template.closedIssuePage.helpers({
/*	currentClosedIssue: function() {
		return ClosedIssues.findOne(Session.get('currentClosedIssueId'));
	},*/
	currentClosedIssue: function() {
		return Issues.findOne(Session.get('currentClosedIssueId'));
	},
	comments: function() {
		return Comments.find({issueId: this._id});
	}
});
