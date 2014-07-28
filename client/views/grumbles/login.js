Template.login.events({
	'submit form' : function(e) {
		e.preventDefault();
		var id = $(e.target).find('[name=id]').val();
		console.log($(e.target).find('[name=id]').val());
		var password = $(e.target).find('[name=password]').val();
		console.log($(e.target).find('[name=password]').val());
		Meteor.loginWithPassword(id, password, function(err, result){
			if(err){
				alert(error.reason || "Your username or password was not found in the database. Try again or create an account.");
			}
		});
	}
});