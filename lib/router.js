/**
 * map URLs to specific templates in the {{renderPage}} helper
 */
Router.configure({

    layoutTemplate: 'layout'
});

Router.map(function() {
    this.route('issues', {path:'/'});
    this.route('issues', {path:'/issues', template: 'issues'});
    this.route('closedIssues', {path:'/closedIssues', template: 'closedIssues'});
    this.route('subscribedKeywords', {path:'/subscribedKeywords', template: 'subscribedKeywords'});
    this.route('grumble', {path:'/grumble'});
    this.route('grumble2', {path:'/grumble2'});
    this.route('issuePage', {

        path:'/issues/:_id',
        data: function() {Session.set('currentIssueId', this.params); }
    });

    this.route('closedIssuePage', {

        path:'/closedIssues/:_id',
        data: function() { Session.set('currentClosedIssueId', this.params); }
    });
});

var requireLogin = function() {
    if ( Meteor.user()) 
        this.render(this.params);
    else if (Meteor.loggingIn())
        this.render('loading');
    else
        this.render('accessDenied');


        this.stop();
        //pause();

}

/*var clear = function() {
    clearErrors();
    this.render(this.params);

    //this.stop();
    pause();

} */

Router.onBeforeAction(requireLogin, {only: 'grumble'});
//Router.onBeforeAction(clear);