var getEmail = function(id, callback){
	Meteor.call('getUserEmail', id, function(error, result){
		if(error){
			throwError(error.reason);
		} else{
			callback(result);
		}
	});
}

Template.login.events({
	'submit form' : function(e) {
		e.preventDefault();
		var user = $(e.target).find('[name=id]').val();
		var psswd = $(e.target).find('[name=password]').val();
		Meteor.loginWithPassword(user, psswd, function(error){
			if(error){
				throwError(error.reason || "Unknown Error.");
			} else{
				Router.go('home');
			}
		});
	},

	'click .forgot' : function(e) {
		e.preventDefault();
		var id = document.getElementById('id').value;
		if(id == ""){
			throwError("Please enter your username or email address.");
			return;
		}
		
		getEmail(id, function(returnValue){
			email = returnValue;
			if(email !== undefined && email !== ""){
				Accounts.forgotPassword({email: email}, function(error){
					if(error){
						throwError(error.reason || "Unknown error");
					}
					else{
						alert("Reset password email sent to your listed email address. Check your emails and follow the instructions to reset your password");
					}
				});
			} else{
				throwError("The username/email address you entered has not been found in the user database. Please double check that it has been entered correctly. If so, then your account does not exist and you will need to register with the button below.");
			}
		});
		/*if(Meteor.users.findOne({"emails.address" : id})){
			alert(Meteor.users.find({"emails.address" : id}));
			Accounts.forgotPassword(id, function(error){
				if(error){
					alert(error.reason || "Unknown error");
				}
				else{
					Router.go('resetPassword');
				}
			});
		} else{
			alert(id);
			var user = Meteor.users.findOne({"username": id});
			alert(Meteor.users.find({username : id}).count()); 
			if(user){
				var email = user.emails[0].address;
				Accounts.forgotPassword(email, function(error){
					if(error){
						alert(error.reason || "Unknown error");
					}
					else{
						Router.go('resetPassword');
					}
				});
			}*/
	}
});
