/**
 * Comment submission event handler
 */
Template.commentSubmit.events({
	'submit form': function(e, template) {
			e.preventDefault();
			var $body = $(e.target).find('[name=body]');
			var action = $(e.target).find('[name=action]').val();
			var anonymous = $(e.target).find('[name=anonymous]').prop('checked');
			var comment = {
			body: $body.val(),
			action: action,
			anonymous: anonymous,
			issueId: template.data._id
		};
		Meteor.call('comment', comment, function(error, commentId) {
			if (error){
				throwError(error.reason || "Unknown error creating comment");
			} else {
				$body.val('');
			}
		});
	}
});
