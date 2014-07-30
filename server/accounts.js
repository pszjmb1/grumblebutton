Meteor.methods({
	modifyUser: function(id, username, email){
		Meteor.users.update({_id: id},{$set: {'username': username, 'email': email}})
	}
});