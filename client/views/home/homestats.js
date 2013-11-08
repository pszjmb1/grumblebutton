/**
 * Template helper for stats on homepage
 */

Template.homestats.helpers({
	issuesThisWeek: function() {
		return weekPostCount;
	},
	// Determine if curent list of issues is ready
	closedThisWeek: function() {
		var now = new Date().getTime();
		return Issues.find({closed: {$gt: now - 7 * 24 * 3600 * 1000} }).count();
	}
});
