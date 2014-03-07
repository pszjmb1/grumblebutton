/**
 * Helpers for rendering Issue detail pages.
 */

Template.closedIssuePage.helpers({
	currentClosedIssue: function() {
		return ClosedIssues.findOne(Session.get('currentClosedIssueId'));
	},
	comments: function() {
		return Comments.find({issueId: this._id});
	}
});
