/**
 * Grumble Button comments collection routines for client and server. Comments
 * are attached to issues.
 */

Comments = new Meteor.Collection('comments');

Meteor.methods({
	toggleCommentSearch : function (id, status) {
		Comments.update(id, {$set: {commentSearch: status}});
	},

	comment: function(commentAttributes) {
		var user = Meteor.user();
		var issueId = commentAttributes.issueId;

		// Error check
		if (!user)
			throw new Meteor.Error(401, "You need to login to comment.");
		if (!commentAttributes.body)
			throw new Meteor.Error(422, 'Please write a comment.');
		if (!commentAttributes.issueId)
			throw new Meteor.Error(422, 'Please comment on an issue.');
		if (!commentAttributes.action)
			throw new Meteor.Error(422, 'Please add what type of comment this is.');

		comment = _.extend(_.pick(commentAttributes, 'issueId', 'body', 'action'), {
			userId: user._id,
			author: (commentAttributes.anonymous ? 'anonymous' : user.profile.addressing),
			// Field to know which comment user wants to display
			commentSearch: 0,  
			submitted: new Date().getTime()
		});

		// update the issue with the number of comments
		Issues.update(comment.issueId, {$inc: {commentsCount: 1}});

		// create the comment, save the id
		// console.log(comment);
		comment._id = Comments.insert(comment);
		// now create a notification, informing the user that there's been a comment
		// console.log(comment);
		createCommentNotification(comment);
		return comment._id;

		}
});
