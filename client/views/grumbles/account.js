var setDetails = function() {
	var userInfo = Meteor.user();
	if(Meteor.user()){
		document.getElementById("user").value = userInfo.username;
		document.getElementById("email").value = userInfo.emails[0].address;
		document.getElementById("firstName").value = userInfo.profile.firstName;
		document.getElementById("surname").value = userInfo.profile.surname;
		document.getElementById("room").value = userInfo.profile.room
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
			if($(e.target).find('[name=password]').val() !== ""){
				Accounts.changePassword($(e.target).find('[name=oldPassword]').val(), $(e.target).find('[name=password]').val());
			}
			var username = $(e.target).find('[name=user]').val();
			var email = $(e.target).find('[name=email]').val();
			var profile = {
				firstName: $(e.target).find('[name=firstName]').val(),
				surname: $(e.target).find('[name=surname]').val(),
				unit: $(e.target).find('[name=unit]').val(),
				unitNm: $(e.target).find('[name=unit] option:selected').text(),
				dept: $(e.target).find('[name=department]').val(),
				deptNm: $(e.target).find('[name=department] option:selected').text(),
				room: $(e.target).find('[name=room]').val()
			};
			Meteor.call("modifyUser", Meteor.userId(), username, email, profile);
			alert("Account Information changed.");
			Router.go('/');
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
	firstName: function() {
		if(Meteor.user().profile !== undefined){
			return Meteor.user().profile.firstName;
		}
		else{
			return "";
		}
	},
	surname: function() {
		if(Meteor.user().profile !== undefined){
			return Meteor.user().profile.surname;
		}
		else{
			return "";
		}
	},
	unit: function(option){
		if(Meteor.user().profile !== undefined){
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
		if(Meteor.user().profile !== undefined){
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
		if(Meteor.user().profile !== undefined){
			return Meteor.user().profile.room;
		}
		else{
			return "";
		}
	}
});

Template.account.helpers({
	username: function(){
		if(Meteor.user() !== null){
			return Meteor.user().username;
		}
		else {
			return "";
		}
	},
	email: function(){
		if(Meteor.user() !== null){
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

var units = [
	{text: "Acute Medicine", value: "AMed"},
	{text: "Intensive Care", value: "IC"},
	{text: "Maternity", value: "Mat"},
	{text: "Accident and Emergency", value: "ANE"},
	{text: "Cardiology", value: "Card"},
	{text: "Diagnostic Imaging", value: "DI"}
]

var unitDepts = {
	AMed: [
		{text: "Acute Medicine Receiving Unit", value: "AMRU"},
		{text: "Lynn Jarrett Unit", value: "LJU"},
		{text: "Ward B3", value: "B3"},
		{text: "Ward D57", value: "D57"}
	],
	IC: [
		{text: "", value: ""}
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
