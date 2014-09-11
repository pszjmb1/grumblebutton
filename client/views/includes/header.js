Template.header.events({
	'click .logout' : function(e) {
		e.preventDefault();
		Meteor.logout(function(err){
			if(err){
				throwError(err.reason || "Unknown error logging out.");
			}
			else{
				Router.go('home');
			}
		});
	}
});