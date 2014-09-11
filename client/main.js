/**
 * Main client subscription rules
 */


// Single issue and Comments subscription reacts when the current issue
// changes.
// var loggedIn = false;
Deps.autorun(function() {
	openIssuesHandle = Meteor.subscribeWithPagination('newOpenIssues',10);
	closedIssuesHandle = Meteor.subscribeWithPagination('newClosedIssues', 10);
	Meteor.subscribe('singleIssue', Session.get('currentIssueId'));
	//Meteor.subscribe('issues', Session.get('currentIssueId'));
	Meteor.subscribe('comments', Session.get('currentIssueId'));	
	Meteor.subscribe('users');
});

Meteor.subscribe('notifications');
Meteor.subscribe('subscribed');








