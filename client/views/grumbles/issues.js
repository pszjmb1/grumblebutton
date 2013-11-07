Template.issues.helpers({
	issues: function() {
		return Issues.find({}, {sort: {submitted: -1}});
	}
});
