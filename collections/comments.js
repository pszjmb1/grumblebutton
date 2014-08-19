/**
 * Grumble Button comments collection routines for client and server. Comments
 * are attached to issues.
 */

Comments = new Meteor.Collection('comments');

Meteor.methods({
	comment: function(commentAttributes) {
		var user = Meteor.user();
		var issue = Issues.findOne(commentAttributes.issueId);

		// Error check
		if (!user)
			throw new Meteor.Error(401, "You need to login to comment.");
		if (!commentAttributes.body)
			throw new Meteor.Error(422, 'Please write a comment.');
		if (!commentAttributes.issueId)
			throw new Meteor.Error(422, 'Please comment on an issue.');

		comment = _.extend(_.pick(commentAttributes, 'issueId', 'body'), {
			userId: user._id,
			author: Meteor.call('getUserName', user._id),
			// Field to know which comment user wants to display
			commentSearch: 0,  
			submitted: new Date().getTime()
		});

		// update the issue with the number of comments
		Issues.update(comment.issueId, {$inc: {commentsCount: 1}});

		// create the comment, save the id
		comment._id = Comments.insert(comment);
		// now create a notification, informing the user that there's been a comment
		createCommentNotification(comment);
		return comment._id;

		}
});
