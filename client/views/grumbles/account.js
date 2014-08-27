var setDetails = function() {
	var userInfo = Meteor.user();
	if(Meteor.user()){
		document.getElementById("email").value = userInfo.emails[0].address;
		document.getElementById("firstName").value = userInfo.profile.firstName;
		document.getElementById("surname").value = userInfo.profile.surname;
		document.getElementById("room").value = userInfo.profile.room

		//reset the title
		var select = document.getElementById("title");
		for(var title = 0; title < select.options.length; title++){
			if(select.options[title].value == userInfo.profile.title){
				select.selectedIndex = title;
				break;
			}
		}

		//reset the unit
		select = document.getElementById("unit");
		for(var unit = 0; unit < select.options.length; unit++){
			if(select.options[unit].value == userInfo.profile.unit){
				select.selectedIndex = unit;
				break;
			}
		}

		//reset the department based on the unit
		select = document.getElementById("department");
		var unit = document.getElementById("unit").options[document.getElementById("unit").selectedIndex].value;
		//first have to populate the select with the correct options
		select.options.length = 1;
		for(var depts = 0; depts < unitDepts[unit].length; depts++){
			var dept = unitDepts[unit][depts];
			select.options.add(new Option(dept.text, dept.value));
		}
		//then find the correct option
		for(var dept = 0; dept < select.options.length; dept++){
			if(select.options[dept].value == userInfo.profile.dept){
				select.selectedIndex = dept;
				break;
			}
		}
	}
};

var getAddressing = function(form) {
	var address = new Array();
	address.push($(form.target).find('[name=title]').val());
	address.push($(form.target).find('[name=firstName]').val());
	address.push($(form.target).find('[name=surname]').val());
	address = address.filter(function() {return true;});
	return address.join(" ");
}

//Function that modifies the labels on fields if the template helper is blank - implemented in template header currently
/*Template.modifyAccount.rendered = function(){
	setTimeout(function (){
		this.$(".formField").each(function() {
			console.log("Object value: " + this.children[0].value);
			if($(this).children().first().val() !== ""){
				$(this).children().addClass("filled");
			}
		});
	}, 2000);
}*/

Template.modifyAccount.events({

	'submit form' : function(e) {
		e.preventDefault();
		var email = $(e.target).find('[name=email]').val();
		var profile = {
			title: $(e.target).find('[name=title]').val(),
			firstName: $(e.target).find('[name=firstName]').val(),
			surname: $(e.target).find('[name=surname]').val(),
			addressing: getAddressing(e),
			unit: $(e.target).find('[name=unit]').val(),
			unitNm: (($(e.target).find('[name=unit]').val() !== "") ? $(e.target).find('[name=unit] option:selected').text() : ""),
			dept: $(e.target).find('[name=department]').val(),
			deptNm: (($(e.target).find('[name=department]').val() !== "") ? $(e.target).find('[name=department] option:selected').text() : ""),
			room: $(e.target).find('[name=room]').val()
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
	},

	'change #unit' : function(e) {
		var select = document.getElementById("department");
		// console.log(document.getElementById("department"));
		var unit = $(e.currentTarget).val();
		select.options.length = 1;
		for(var depts = 0; depts < unitDepts[unit].length; depts++){
			var dept = unitDepts[unit][depts];
			select.options.add(new Option(dept.text, dept.value));
		}
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
		if(Meteor.user().profile){
			Meteor.defer(function () {
				$(".formField:has(label[for='surname'])").children().addClass("filled")
			});
			return Meteor.user().profile.surname;
		}
		else{
			return "";
		}
	},
	unit: function(option){
		if(Meteor.user().profile){
			if(option == Meteor.user().profile.unit){
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
	department: function(option){
		if(Meteor.user().profile){
			if(option == Meteor.user().profile.dept){
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
	room: function(){
		if(Meteor.user().profile){
			Meteor.defer(function () {
				$(".formField:has(label[for='room'])").children().addClass("filled");
			});
			return Meteor.user().profile.room;
		}
		else{
			return "";
		}
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

Template.modifyAccount.unitFill = function(){
	return units;
}

Template.modifyAccount.deptFill = function(){
	if(Meteor.user().profile.unit){
		return unitDepts[Meteor.user().profile.unit];
	}
	else{
		return [];
	}
};

var modify = function(email, profile){
	Meteor.call("modifyUser", Meteor.userId(), email, profile, function(error){
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

var units = [
	{text: "Acute Medicine", value: "AMed"},
	{text: "Intensive Care", value: "IC"},
	{text: "Maternity", value: "Mat"},
	{text: "Accident and Emergency", value: "ANE"},
	{text: "Cardiology", value: "Card"},
	{text: "Diagnostic Imaging", value: "DI"}
]

var unitDepts = {
	"": [
		{text: "Reception", value: "REC"}
	],
	AMed: [
		{text: "Acute Medicine Receiving Unit", value: "AMRU"},
		{text: "Lynn Jarrett Unit", value: "LJU"},
		{text: "Ward B3", value: "B3"},
		{text: "Ward D57", value: "D57"}
	],
	IC: [
		{text: "Adult Intensive Care", value: "AICU"},
		{text: "Surgical High Dependency", value: "SHDU"},
		{text: "Medical High Dependency", value: "MHDU"},
		{text: "Critical Care department", value: "CCD"}
	],
	Mat: [
		{text: "Ante-Natal Clinic City Hospital", value: "ANCH"},
		{text: "Ante-Natal Clinic QMC", value: "ANQM"}
	],
	ANE: [
		{}
	],
	Card: [
	],
	DI: [
		{text: "X-ray", value: "XR"},
		{text: "Orthopaedic clinic", value: "Orth"},
		{text: "MRI department", value: "MRI"},
		{text: "CT Scanners", value: "CT"},
		{text: "Emergency/fracture clinic", value: "EF"},
		{text: "Ultrasound department", value: "US"},
		{text: "Obstetric ultrasound", value: "Obs"},
		{text: "Angiography and interventional suites", value: "AIS"},
		{text: "PET CT Scanner", value: "PET"},
		{text: "Lithotripsy suite", value: "Lith"},
		{text: "Paediatric Department", value: "Paed"}
	]
}
