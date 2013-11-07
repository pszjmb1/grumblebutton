Template.grumble.events({
	'submit form': function(e) {
		e.preventDefault();
		var issue = {
			date: $(e.target).find('[name=date]').val(),
			time: $(e.target).find('[name=time]').val(),
			dept: $(e.target).find('[name=dept]').val(),
			unit: $(e.target).find('[name=unit]').val(),
			room: $(e.target).find('[name=room]').val(),
			urgency: $(e.target).find('[name=urgency]').val(),
			category: $(e.target).find('[name=category]').val(),
			subcategory: $(e.target).find('[name=subcategory]').val(),
			shortdesc: $(e.target).find('[name=shortdesc]').val(),
			details: $(e.target).find('[name=details]').val(),
			anonymous: $(e.target).find('[name=anonymous]').val(),
		}

		Meteor.call('grumble', issue, function(error, id) {
			if (error)
				throwError(error.reason);
			else
				Meteor.Router.to('issuePage', id);
		});
	}
});
