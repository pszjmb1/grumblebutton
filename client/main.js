/**
 * Main client subscription rules
 */

openIssuesHandle = Meteor.subscribeWithPagination('newOpenIssues',10);
closedIssuesHandle = Meteor.subscribeWithPagination('newClosedIssues', 10);

// Single issue and Comments subscription reacts when the current issue
// changes.
// var loggedIn = false;
Deps.autorun(function() {
	Meteor.subscribe('singleIssue', Session.get('currentIssueId'));
	//Meteor.subscribe('issues', Session.get('currentIssueId'));
	Meteor.subscribe('comments', Session.get('currentIssueId'));
	//Meteor.subscribe('users');	
	Meteor.subscribe('users');

	/*if(!Meteor.userId()){
		if(loggedIn){
			window.location.replace("/");
		}
		else{
			loggedIn = true;
		} 
	}*/
});

Meteor.subscribe('notifications');
Meteor.subscribe('subscribed');








