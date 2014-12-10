/**
*
*Template for getting the values of the sayIt.today so that manager and subscribed users of that particular domain can be notified.
*/
Template.report.events({
	'submit form': function(e) {
		e.preventDefault();
		var issue = {
			date: $(e.target).find('[name=date]').val(),
			time: $(e.target).find('[name=time]').val(),
			location: $(e.target).find('[name=location]').val(),
			details: $(e.target).find('[name=description]').val(),
			shortdesc: titleParse($(e.target).find('[name=description]').val()),
			anonymous: $(e.target).find('[name=anonymous]:checked').val(),
			device: navigator.userAgent,
			ongoing: $(e.target).find('[name=ongoing]').prop('checked')
		}
		// Getting all the field values of the form
		var details = document.querySelector('[name=description]').value;
		var shortdesc = titleParse(document.querySelector('[name=description]').value);
		var senderEmail = 'grumblebutton@gmail.com';		
		var user = Meteor.user();
		var subjectOfEmail = "Notification of New Issue";
		var location = document.querySelector('[name=location]').value;
		var author = document.querySelector('[name=anonymous]:checked').value;
		var authorName = Meteor.user().profile.addressing;
		var j, people='';
		// List of Domains present in the collection Subscribed
		var listOfDomain = Subscribed.find();

		Meteor.call('grumble', issue, function(error, id)
		{
			if (error)
			{
				throwError(error.reason || "Unknown error submitting issue"); 
			}
			else
			{
				var issueId = id;
				Meteor.call('createPostNotification', issueId, authorName, author, function(error) {
					if(error){
						throwError(error.reason || "Unknown error creating notification");
					}
				});
				
				listOfDomain.forEach( function(myDoc) 
				{
					// Creating regular expression to check all possible format in which user can enter domain name
					var regEx = new RegExp("^.*"+myDoc.category+".*","gi"); 

					// Checking whether domain name is present in the details part of the form
					if(shortdesc || location || details) //|| category)
					{
						if(shortdesc.match(regEx) || location.match(regEx) || details.match(regEx) )
						{
							// Users who have subscribed to that domain, from Subscribed collection
 		 					people = myDoc.categorySubscribedUsers;
							if(people && people.length)
							{
								for(j=0;j<people.length;j++)
								{
									Meteor.call('user', senderEmail, issueId, subjectOfEmail, people[j], shortdesc, authorName, function(error, result)
									{
										if(error){
											throwError(error.reason || "Unknown error informing other users");
										}
									});
								}
							}
						}
					}
				});
				Meteor.call('setDefaultValue', function(error) {
					if(error){
						throwError(error.reason || "Unknown error resetting defaults");
					}
				});
				Router.go('thankyou');									
			}
		});
	}
});


Template.grumble.helpers({
	date: function() {
		var date = new Date();
	    var d = date.getDate();
	    var m = date.getMonth() + 1;
	    var y = date.getFullYear();
	    Meteor.defer(function () {
	    	$(".formField:has(label[for='date'])").children().addClass("filled");
	    });
	    return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
	},
	time: function(){
		var date = new Date();
		var hours = date.getHours();
		var min = date.getMinutes();
		Meteor.defer(function () {
			$(".formField:has(label[for='time'])").children().addClass("filled");
		});
		return '' + (hours<=9 ? '0' + hours : hours) + ':' + (min<=9 ? '0' + min : min);
	},
	location: function(){
		var user = Meteor.user();
		var profile = user.profile;
		if(profile.site || profile.department || profile.ward){
			var locationString = new Array();
			if(profile.site)
				locationString.push(profile.site);
			if(profile.department)
				locationString.push(profile.department);
			if(profile.ward)
				locationString.push(profile.ward);
			Meteor.defer(function () {
				$(".formField:has(label[for='location'])").children().addClass("filled");
			});
			return locationString.join(", ");
		}
	}
});

var titleParse = function(string) {
	if(string.split(" ")[0].length > 75)
		return string.slice(0, 75);
	var title = string.split(/[.!?,;:-]/, 1).join();
	title = title.split(" ").slice(0, 15).join(" ");
	return title;
}
