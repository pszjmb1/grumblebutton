Meteor.methods({
	modifyUser: function(id, username, email, profile){
		Meteor.users.update({_id: id},{$set: {'username': username, 'emails[0].address': email, 'profile': profile}});
	}
});