/**
 * Client-side error handling and display
 */

// Local (client-only) collection
Errors = new Meteor.Collection(null);

Errors.allow({
	insert: function(userId, doc) {
		return true;
	},
	update: function(userId, doc, fieldNames, modifier) {
		return _.contain(fields, 'seen');
	},
	remove: function(userId, doc) {
		return true;
	}
})

throwError = function(message) {
	Errors.insert({message: message, seen: false})
}

clearErrors = function() {
	Errors.remove({seen: true});
}
