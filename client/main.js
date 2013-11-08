/**
 * Main client subscription rules
 */

issuesHandle = Meteor.subscribeWithPagination('issues',10);

// Comments subscription reacts when the current issue changes.
Deps.autorun(function() {
	Meteor.subscribe('comments', Session.get('currentIssueId'));
});
