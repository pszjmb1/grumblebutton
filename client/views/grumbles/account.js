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