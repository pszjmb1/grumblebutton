Template.login.events({
	'submit form' : function(e) {
		e.preventDefault();
		var user = $(e.target).find('[name=id]').val();
		var psswd = $(e.target).find('[name=password]').val();
		Meteor.loginWithPassword(user, psswd, function(error)
		{
			if(error)
			{
				throwError(error.reason || "Unknown Error.");
			} else
			{
				Router.go('home');
			}
		});
	},

	'click .forgot' : function(e) {
		e.preventDefault();
		var id = document.getElementById('id').value;
		if(id == "")
		{
			throwError("Please enter your email address.");
			return;
		}
		else
		{
			Accounts.forgotPassword({email: id}, function(error)
			{
				if(error)
					throwError(error.reason || "Unknown error sending reset email. Try again.");
				else
					alert("Reset password email sent to your listed email address. Check your emails and follow the instructions to reset your password");
			});
		}
	}
});
