Template.signUp.events({
	'submit form' : function(e) {
		e.preventDefault();
		/*if ($(e.target).find('[name=securityQuestion]').val() == ""){
			alert("Please choose an appropriate security question.");
			return;
		}*/
		/*else */if($(e.target).find('[name=password]').val() !== $(e.target).find('[name=passwordConfirm]').val()){
			throwError("Your passwords do not match. Please reenter them.");
			$(e.target).find('[name=passwordConfirm]').value = "";
			$(e.target).find('[name=passwordConfirm]').focus();
			return;
		} else if($(e.target).find('[name=user]').val().length < 4){
			throwError("Your username is too short. Please enter a username that is at least 4 characters long.");
			return;
		} else if($(e.target).find('[name=password]').val().length < 6){
			throwError("Your password is too short. Please enter a username that is at least 6 characters long.");
			return;
		} else{
			var options = {};
			options.username = $(e.target).find('[name=user]').val();
			options.password = $(e.target).find('[name=password]').val();
			options.email = $(e.target).find('[name=email]').val();
			var user = Accounts.createUser(options, function(error){
				if(error){
					throwError(error.reason || "There was an unknown error creating your account. Please try again later.")
				}
			});
			Router.go('/');
		}
	}
});