/**
 * Main client subscription rules
 */

issuesHandle = Meteor.subscribeWithPagination('newIssues',10);
// Single issue and Comments subscription reacts when the current issue
// changes.
Deps.autorun(function() {
	Meteor.subscribe('singleIssue', Session.get('currentIssueId'));
	//Meteor.subscribe('issues', Session.get('currentIssueId'));
	Meteor.subscribe('comments', Session.get('currentIssueId'));
	
});

Meteor.subscribe('notifications');
/*Meteor.subscribe('closedIssues');*/
Meteor.subscribe('subscribed');





