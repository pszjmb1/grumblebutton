/**
 * Template helpers for comments
 */

/**
 * Format date as human-readable
 */
Template.comment.helpers({
	submittedText: function() {
		return new Date(this.submitted).toString();
	},
	actionText: function() {
		if(this.action == "clarify")
			return "Extra Information";
		else if(this.action == "fix")
			return "Fixed the issue";
		else if(this.action == "work")
			return "Worked on the issue";
		else if(this.action == "question")
			return "Asking a question";
		else
			return "";
	}   	       
});



