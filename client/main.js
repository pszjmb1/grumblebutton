/**
 * Main client subscription rules
 */

Meteor.subscribe('issues');

// Comments subscription reacts when the current issue changes.
Deps.autorun(function() {
	Meteor.subscribe('comments', Session.get('currentIssueId'));
});
