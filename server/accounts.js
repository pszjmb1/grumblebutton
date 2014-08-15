Meteor.methods({
	modifyUser: function(id, username, email, profile){
		var user = Meteor.users.findOne({_id: id});
		Meteor.users.update({_id: id, 'emails.address': user.emails[0].address},{$set: {'username': username, 'emails.$.address': email, 'profile': profile}}, function(error){
			if(error){
				throwError(error);
			}
		});
	}
});

Meteor.methods({
	getUserEmail: function(id){
		// console.log(Meteor.users.findOne({'emails.address' : id}));
		if(Meteor.users.findOne({'emails.address' : id}) !== undefined){
			var user = Meteor.users.findOne({'emails.address' : id});
			return user.emails[0].address;
		}
		else if(Meteor.users.findOne({username : id}) !== undefined){
			var user = Meteor.users.findOne({username : id});
			return user.emails[0].address;
		}
		else return "";
	},

	getUser: function(id){
		var person = Meteor.users.findOne({_id: id}, {fields: {'username': 1, 'emails': 1, 'notified': 1}});
		return(person);
	}
});