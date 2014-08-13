Template.header.events({
	'click .logout' : function(e) {
		e.preventDefault();
		Meteor.logout(function(err){
			if(err){
				throwError(err.reason || "Unknown Error.");
			}
			else{
				Router.go('home');
			}
		});
	}
});