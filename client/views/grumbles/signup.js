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
			var options = {};
			options.username = $(e.target).find('[name=user]').val();
			options.password = $(e.target).find('[name=password]').val();
			options.email = $(e.target).find('[name=email]').val();
			var user = Accounts.createUser(options);
			Router.go('/');
		}
	}
});