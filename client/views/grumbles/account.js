var setDetails = function() {
	var userInfo = Meteor.user();
	if(Meteor.user()){
		document.getElementById("email").value = userInfo.emails[0].address;
		document.getElementById("firstName").value = userInfo.profile.firstName;
		document.getElementById("surname").value = userInfo.profile.surname;
		document.getElementById("site").value = userInfo.profile.site;

		//reset the title
		var select = document.getElementById("title");
		for(var title = 0; title < select.options.length; title++){
			if(select.options[title].value == userInfo.profile.title){
				select.selectedIndex = title;
				break;
			}
		}

		//reset the department
		document.getElementById("department").value = userInfo.profile.department;

		//reset the department based on the unit
		document.getElementById("ward").value = userInfo.profile.ward;
	}
};

var getAddressing = function(form) {
	var address = new Array();
	if($(form.target).find('[name=title]').val())
		address.push($(form.target).find('[name=title]').val());
	if($(form.target).find('[name=firstName]').val())
		address.push($(form.target).find('[name=firstName]').val());
	if($(form.target).find('[name=surname]').val())
		address.push($(form.target).find('[name=surname]').val());
	return address.join(" ");
}

Template.modifyAccount.events({

	'submit form' : function(e) {
		e.preventDefault();
		var email = $(e.target).find('[name=email]').val();
		var profile = {
			title: $(e.target).find('[name=title]').val(),
			firstName: $(e.target).find('[name=firstName]').val(),
			surname: $(e.target).find('[name=surname]').val(),
			addressing: getAddressing(e),
			department: $(e.target).find('[name=department]').val(),
			ward: $(e.target).find('[name=ward]').val(),
			site: $(e.target).find('[name=site]').val()
		};
		var passwdSuccess = true;
		if($(e.target).find('[name=password]').val() !== ""){
			if($(e.target).find('[name=password]').val().length < 6){
				throwError("Your new password is too short. Please enter a password that is at least 6 characters long.");
				return;
			}
			else if($(e.target).find('[name=password]').val() !== $(e.target).find('[name=passwordConfirm]').val()){
				throwError("Your passwords do not match. Please reenter them.");
				$(e.target).find('[name=passwordConfirm]').value = "";
				$(e.target).find('[name=passwordConfirm]').focus();
				return;
			}
			else{
				Accounts.changePassword($(e.target).find('[name=oldPassword]').val(), $(e.target).find('[name=password]').val(), function(error){
					if(error){
						throwError(error.reason || "There was an unknown error in changing the password");
						passwdSuccess = false;
					}
					else{
						modify(email, profile);
					}
				});
			}
		}else{
			modify(email, profile)
		}
	},
	
	'click .reset' : function(e) {
		setDetails();
	}

});

Template.modifyAccount.helpers({
	title: function(option) {
		if(Meteor.user().profile){
			if(option == Meteor.user().profile.title){
				return 'selected';
			}
			else{
				return '';
			}
		}
		else{
			return '';
		}
	},
	firstName: function() {
		if(Meteor.user().profile.firstName){
			Meteor.defer(function () {
				$(".formField:has(label[for='firstName'])").children().addClass("filled")
			});
			return Meteor.user().profile.firstName;
		}
		else{
			return "";
		}
	},
	surname: function() {
		if(Meteor.user().profile.surname){
			Meteor.defer(function () {
				$(".formField:has(label[for='surname'])").children().addClass("filled")
			});
			return Meteor.user().profile.surname;
		}
		else{
			return "";
		}
	},
	ward: function(option){
		if(Meteor.user().profile.ward){
			Meteor.defer(function () {
				$(".formField:has(label[for='ward'])").children().addClass("filled")
			});
			return Meteor.user().profile.ward;
		}
		else{
			return "";
		}
	},
	department: function(){
		if(Meteor.user().profile.department){
			Meteor.defer(function () {
				$(".formField:has(label[for='department'])").children().addClass("filled")
			});
			return Meteor.user().profile.department;
		}
		else{
			return "";
		}
	},
	site: function(){
		if(Meteor.user().profile.site){
			Meteor.defer(function (){
				$(".formField:has(label[for='site'])").children().addClass("filled");
			});
			return Meteor.user().profile.site;
		}
		else
			return "";
	}
});

Template.account.helpers({
	email: function(){
		if(Meteor.user()){
			Meteor.defer(function () {
				$(".formField:has(label[for='email'])").children().addClass("filled");
			});
			return Meteor.user().emails[0].address;
		}
		else{
			return "";
		}
	}
});

var modify = function(email, profile){
	Meteor.call("modifyUser", email, profile, function(error){
		if(error){
			throwError(error.reason || "Unknown error with updating user information.");
			return;
		}
		else{
			alert("Account Information changed.");
			Router.go('/');
		}
	});
}