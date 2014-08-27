Meteor.methods({
	modifyUser: function(id, email, profile){
		var user = Meteor.users.findOne({_id: id});
		Meteor.users.update({_id: id, 'emails.address': user.emails[0].address},{$set: {'emails.$.address': email, 'profile': profile}}, function(error){
			if(error){
				throwError(error);
			}
		});
	},

	getUserEmail: function(email){
		// console.log(Meteor.users.findOne({'emails.address' : id}));
		if(Meteor.users.findOne({'emails.address' : email}) !== undefined){
			var user = Meteor.users.findOne({'emails.address' : email});
			return user.emails[0].address;
		}
		else return "";
	},

	getUser: function(id){
		var person = Meteor.users.findOne({_id: id}, {fields: {'emails': 1, 'notified': 1}});
		return(person);
	},

	getUserName: function(id){
		var user = Meteor.users.findOne({_id: id});
		var name = "";
		if(user.profile.firstName){
			name += user.profile.firstName + " ";
		}
		if(user.profile.surname){
			name += user.profile.surname;
		}
		return name;
	},
});

Accounts.onCreateUser(function(options, user) {
	user.profile = options.profile ? options.profile : {'addressing' : "anonymous"};
	return user;
})