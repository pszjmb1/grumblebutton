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
			submitted: new Date().getTime()
		});

		// update the issue with the number of comments
		Issues.update(comment.issueId, {$inc: {commentsCount: 1}});

		return Comments.insert(comment);
	}
});
