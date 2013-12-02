/**
 * Template helpers for comments
 */

/**
 * Format date as human-readable
 */
Template.comment.helpers({
	submittedText: function() {
		return new Date(this.submitted).toString();
	}
});
