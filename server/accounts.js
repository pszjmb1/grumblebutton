Meteor.methods({
	modifyUser: function(email, profile){
		var user = Meteor.users.findOne({_id: Meteor.userId()});
		Meteor.users.update({_id: Meteor.userId(), 'emails.address': user.emails[0].address},{$set: {'emails.$.address': email, 'profile': profile}}, function(error){
			if(error){
				throwError(error);
			}
		});
	}
});

Accounts.onCreateUser(function(options, user) {
	user.profile = options.profile ? options.profile : {'addressing' : "anonymous"};
	return user;
})