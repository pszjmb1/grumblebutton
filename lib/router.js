/**
 * map URLs to specific templates in the {{renderPage}} helper
 */
Router.configure({

    layoutTemplate: 'layout'
});

Router.map(function() {
    this.route('home', {path:'/'});
    this.route('issues');
    this.route('closedIssues');
    this.route('notificationsPage', {path:'/watchlist'});    
    this.route('report', {path:'/sayit'});
    this.route('modifyAccount', {path:'account'});
    this.route('signup', {template: 'signUp'})
    this.route('notifications');
    
    this.route('issuePage', {
        path:'/issues/:_id',
        data: function() { Session.set('currentIssueId', this.params._id); }
    });

    this.route('closedIssuePage', {

        path:'/closedIssues/:_id',
        data: function() { Session.set('currentClosedIssueId', this.params._id); }
    });

    this.route('referIssuePage', {
        path:'/issues/:_id',
        data: function() { Session.set('currentIssueId', this._id); }
    });
});

var requireLogin = function() {
    if ( Meteor.user()) 
        this.render(this.params);
    else if (Meteor.loggingIn())
        this.render('loading');
    else
        Router.go('home');


        //this.stop();
        //pause();

}

var goToIssues = function() {
    if(Meteor.user()){
        Router.go('issues');
    }
}

var clear = function() {
    clearErrors();
    this.render(this.params);

    //this.stop();
    // pause();

}

Router.onBeforeAction(requireLogin, {except: ['home','signup']});
Router.onBeforeAction(goToIssues, {only: 'home'});
Router.onBeforeAction(clear);
