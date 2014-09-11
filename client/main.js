/**
 * Main client subscription rules
 */


// Single issue and Comments subscription reacts when the current issue
// changes.
Deps.autorun(function() {
	openIssuesHandle = Meteor.subscribeWithPagination('newOpenIssues',10);
	closedIssuesHandle = Meteor.subscribeWithPagination('newClosedIssues', 10);
	Meteor.subscribe('singleIssue', Session.get('currentIssueId'));
	notificationHandle = Meteor.subscribeWithPagination('notifications', 10);
	//Meteor.subscribe('issues', Session.get('currentIssueId'));
	Meteor.subscribe('comments', Session.get('currentIssueId'));	
	Meteor.subscribe('users');
	Meteor.subscribe('subscribed');
});









