/**
 * Helpers for rendering Issue detail pages.
 */

Template.issuePage.helpers({
	currentIssue: function() {
		//alert('inside issuePage');
		return Issues.findOne(Session.get('currentIssueId'));
		//alert('after returning issue -> issue_page.js');

	},
	comments: function() {
		return Comments.find({issueId: this._id});
	}
});
