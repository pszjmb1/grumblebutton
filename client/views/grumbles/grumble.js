/**
*
*Template for getting the values of the sayIt.today so that manager and subscribed users of that particular domain can be notified.
*/
Template.report.events({
	'submit form': function(e) {
		//alert('grumble.js');
		e.preventDefault();
		var issue = {
			date: $(e.target).find('[name=date]').val(),
			time: $(e.target).find('[name=time]').val(),
			location: $(e.target).find('[name=location]').val(),
			details: $(e.target).find('[name=description]').val(),
			shortdesc: titleParse($(e.target).find('[name=description]').val()),
			anonymous: $(e.target).find('[name=anonymous]').val(),
			device: navigator.userAgent,
			ongoing: $(e.target).find('[name=ongoing]').prop('checked')
			//urgency: $(e.target).find('[name=urgency]').val(),
			//category: $(e.target).find('[name=category]').val(),
		}
		// console.log(issue);
		
		// Getting all the field values of the form
		var details = document.querySelector('[name=description]').value;
		// alert('details '+details);
		var shortdesc = titleParse(document.querySelector('[name=description]').value);
		// alert('shortdesc '+shortdesc);
		//var category = document.querySelector('[name=category]').value; 
		 //alert('category '+category);
		var senderEmail = 'grumblebutton@gmail.com';
		
		var user = Meteor.user();
		// alert('Meteor.user() '+user);

		// Email Id of user who has posted the issue
		var issueRaisedUserEmailId = user.emails[0].address;

		// alert('issueRaisedUserEmailId '+issueRaisedUserEmailId);

		// Manager's Id
		/*if(category)
		{
			if(Subscribed.findOne({category:category}).managerId)
			{
				var receiverId = Subscribed.findOne({category:category}).managerId;
			}
		}	*/
		// alert('receiverId '+receiverId);
	   
		var subjectOfEmail = "Notification of New Issue";
		var location = document.querySelector('[name=location]').value;
		// alert('location '+location);
		//var unit = document.querySelector('[name=unit]').value; 
		var author = document.querySelector('[name=anonymous]').value;
		var authorName = Meteor.user().profile.addressing;
		// alert('unit '+ unit);
		var i,j, person='', myDocId=0, foundValue=0, domainList='';

		// List of Domains present in the collection Subscribed
		var listOfDomain = Subscribed.find();
		var listOfUsers='';
		// alert('everything is correct');

		// alert('inside grumble.js');
		//alert('before calling Meteor.call()');
		Meteor.call('grumble', issue, function(error, id)
		{
			if (error)
			{
				//alert('throwing error');
				throwError(error.reason); 
			}
			else
			{
				
				var messageToUser = "Hello "+authorName+",\n\n"+"Your issue - "+shortdesc+" has been posted successfully"+
    				". The link for the concerned issue is :- http://localhost:15000/issues/";

				// Mail to user about confirmation of the issue created by him    									
				// alert('mail to user itself');
				if(author!='anonymous')
				{
					Meteor.call('sendEmail',
        	   			Meteor.userId(), 
			        	senderEmail,
			        	messageToUser,
				    	id,
						subjectOfEmail);
					// alert('notification to user itself');
					Notifications.insert({
						userId: Meteor.userId(), // users id who has posted the issue
						issueId: id,   // issue id
						//commentId: comment._id,
						//commenterName: comment.author,
						postedUserId: Meteor.userId() ,
						postedUserName: ((author !== 'anonymous') ? authorName : author),
						read: false,
						timestamp: new Date()
					});	 
				}
						

				// alert('before loop of subscribed collection');
				listOfDomain.forEach( function(myDoc) 
				{
					//alert('myDoc.category '+myDoc.category);
					var managerCategory = myDoc.category;
					var messageToManager = "Hello,\n\n"+"The new issue has been posted - "+shortdesc+
    					". Can you please look after this matter asap.\n\n"+
        				"The link for the concerned issue is :- http://localhost:15000/issues/"; 

					// Creating regular expression to check all possible format in which user can enter domain name
					var regEx = new RegExp("^.*"+myDoc.category+".*","gi"); 

					// Checking whether domain name is present in the details part of the form
					if(shortdesc || location || details) //|| category)
					{
						if(issue.shortdesc.match(regEx) || issue.location.match(regEx) || details.match(regEx) )// || category.match(regEx))
						{
							// alert('inside regular expression');
							// Mail to manager regarding pop up of new issue
							//alert('mail to manager');
							/*Meteor.call('sendEmail',
								receiverId,
			        			senderEmail,
			        			messageToManager,
				    			id,
								subjectOfEmail);*/

							// Users who have subscribed to that domain, from Subscribed collection
 		 					people = myDoc.categorySubscribedUsers;
							//alert('before person loop in details part');
							if(people && people.length)
							{
								// alert('people.length'+people.length)
								for(j=0;j<people.length;j++)
								{
									Meteor.call('user', senderEmail, id, subjectOfEmail, people[j], shortdesc, author, function(error, result)
									{
										if(error){
											throwError(error.reason);
										}
									});
								}
							}
						}
					}

					
			});
			
			//alert('unsetting the notified field');
			Meteor.call('setDefaultValue', function(error,result)
			{
			}); 
			//alert('before Meteor.Router.to() inside grumble.js');
			Router.go('thankyou');
			//alert('after Meteor.Router.to() inside grumble.js');
									
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
		if(Meteor.user().profile.site || Meteor.user().profile.department || Meteor.user().profile.ward){
			var profile = Meteor.user().profile;
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
	/*unit: function(){
		if(Meteor.user().profile !== undefined){
			return Meteor.user().profile.unitNm;
		}
		else{
			return "";
		}
	},
	department: function(){
		if(Meteor.user().profile){
			return Meteor.user().profile.deptNm;
		}
		else{
			return "";
		}
	},
	}*/
});

var titleParse = function(string) {
	if(string.split(" ")[0].length > 75)
		return string.slice(0, 75);
	var title = string.split(/[.!?,;:-]/, 1).join();
	title = title.split(" ").slice(0, 15).join(" ");
	return title;
}
