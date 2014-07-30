Template.header.events({
	'click .logout' : function(e) {
		e.preventDefault();
		Meteor.logout(function(err, result){
			if(err){
				alert(error.reason || "Your username or password was not found in the database. Try again or create an account.");
			}
		});
	}
});