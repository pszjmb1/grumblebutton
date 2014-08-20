Meteor.methods({
	modifyUser: function(id, email, profile){
		var user = Meteor.users.findOne({_id: id});
		Meteor.users.update({_id: id, 'emails.address': user.emails[0].address},{$set: {'emails.$.address': email, 'profile': profile}}, function(error){
			if(error){
				throwError(error);
			}
		});
	}
});

Meteor.methods({
	getUserEmail: function(email){
		// console.log(Meteor.users.findOne({'emails.address' : id}));
		if(Meteor.users.findOne({'emails.address' : id}) !== undefined){
			var user = Meteor.users.findOne({'emails.address' : id});
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
	}
});