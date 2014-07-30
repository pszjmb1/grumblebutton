var setDetails = function() {
	var userInfo = Meteor.user();
	if(Meteor.user()){
		document.getElementById("user").value = userInfo.username;
		document.getElementById("email").value = userInfo.emails[0].address;
	}
};

Template.modifyAccount.events({
	'submit form' : function(e) {
		e.preventDefault();
		if($(e.target).find('[name=password]').val() !== $(e.target).find('[name=passwordConfirm]').val()){
			alert("Your passwords do not match. Please reenter them.");
			$(e.target).find('[name=passwordConfirm]').value = "";
			$(e.target).find('[name=passwordConfirm]').focus();
			return;
		}
		else {
			/*var user = {
				'username' : $(e.target).find('[name=user]').val(),
				'email' : $(e.target).find('[name=email]').val()*/
				/*'question' : $(e.target).find('[name=securityQuestion]').val(),
				'answer' : $(e.target).find('[name=answer]').val()*/
			/*};
			console.log(user);
			Accounts.update({_id: Meteor.userId()}, {$set: {'username' : $(e.target).find('[name=user]').val(), 'email' : $(e.target).find('[name=email]').val()
			}});
			if($(e.target).find('[name=password]').val() !== ""){
				var oldPassword = $(e.target).find('[name=oldPassword]').val();
				var newPassword = $(e.target).find('[name=password]').val();
				Accounts.changePassword(oldPassword, newPassword);
			}*/
			if($(e.target).find('[name=password]').val() == ""){
				Meteor.call("modifyUser", Meteor.userId(), $(e.target).find('[name=user]').val(), $(e.target).find('[name=email]').val());
			}else{
				Meteor.call("modifyUser", Meteor.userId(), $(e.target).find('[name=user]').val(), $(e.target).find('[name=email]').val());
				Accounts.changePassword($(e.target).find('[name=oldPassword]').val(), $(e.target).find('[name=password]').val());
			}
			alert("Account Information changed.");
			Router.go('/');
		}
	},
	
	'click .reset' : function(e) {
		setDetails();
		//alert(Meteor.user().username);
		//document.getElementById("user").value = userInfo.username;
	}

});

Template.account.helpers({
	username: function(){
		if(Meteor.user() !== undefined){
			return Meteor.user().username;
		}
		else{
			return "";
		}
	},
	email: function(){
		if(Meteor.user() !== undefined){
			return Meteor.user().emails[0].address;
		}
		else{
			return "";
		}
	}
});

window.onload=function(){
	setDetails();
};