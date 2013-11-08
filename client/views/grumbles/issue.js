/**
 * Template helpers for an issue
 */

Template.issue.helpers({
	commentsCount: function() {
		return Comments.find({issueId: this._id}).count();
	}
});
