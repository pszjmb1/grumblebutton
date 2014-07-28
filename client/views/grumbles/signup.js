Template.signUp.events({
	'submit form' : function(e) {
		e.preventDefault();
		/*if ($(e.target).find('[name=securityQuestion]').val() == ""){
			alert("Please choose an appropriate security question.");
			return;
		}*/
		/*else */if($(e.target).find('[name=password]').val() !== $(e.target).find('[name=passwordConfirm]').val()){
			alert("Your passwords do not match. Please reenter them.");
			$(e.target).find('[name=passwordConfirm]').value = "";
			$(e.target).find('[name=passwordConfirm]').focus();
			return;
		}
		else{
			var user = {
				'username' : $(e.target).find('[name=user]').val(),
				'email' : $(e.target).find('[name=email]').val(),
				'password' : $(e.target).find('[name=password]').val()
				/*'question' : $(e.target).find('[name=securityQuestion]').val(),
				'answer' : $(e.target).find('[name=answer]').val()*/
			}
			var userId = Accounts.createUser(user);
			Router.go('/');
		}
	}
});