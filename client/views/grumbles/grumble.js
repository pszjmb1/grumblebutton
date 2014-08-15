/**
*
*Template for getting the values of the sayIt.today so that manager and subscribed users of that particular domain can be notified.
*/
Template.grumble.events({
	'submit form': function(e) {
		//alert('grumble.js');
		e.preventDefault();
		var issue = {
			date: $(e.target).find('[name=date]').val(),
			time: $(e.target).find('[name=time]').val(),
			dept: $(e.target).find('[name=department]').val(),
			shortdesc: $(e.target).find('[name=shortdesc]').val(),
			anonymous: $(e.target).find('[name=anonymous]').val(),
			device: navigator.userAgent,
			unit: $(e.target).find('[name=unit]').val(),
			room: $(e.target).find('[name=room]').val()
			//urgency: $(e.target).find('[name=urgency]').val(),
			//category: $(e.target).find('[name=category]').val(),
		}
		
		// Getting all the field values of the form
		var details = null;//document.querySelector('[name=details]').value;
		// alert('details '+details);
		var shortdesc = document.querySelector('[name=shortdesc]').value;
		// alert('shortdesc '+shortdesc);
		//var category = document.querySelector('[name=category]').value; 
		 //alert('category '+category);
		var senderEmail = 'grumblebutton@gmail.com';
		
		var user = Meteor.user();
		// alert('Meteor.user() '+user);

		// Email Id of user who has posted the issue
		var issueRaisedUserEmailId = user.emails[0].address;

		// alert('issueRaisedUserEmailId '+issueRaisedUserEmailId);

		// Manager's Email Id
		/*if(category)
		{
			if(Subscribed.findOne({category:category}).emailId)
			{
				var receiverEmail = Subscribed.findOne({category:category}).emailId;
			}
		}	*/
		// alert('receiverEmail '+receiverEmail);
	   

		var subjectOfEmail = "Notification of New Issue";
		var location = document.querySelector('[name=unit]').value + " " + document.querySelector('[name=department]').value +" "+ document.querySelector('[name=room]').value;
		// alert('location '+location);
		//var unit = document.querySelector('[name=unit]').value; 
		var author = document.querySelector('[name=anonymous]').value; 
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
				
				var messageToUser = "Hello "+Meteor.user().username+",\n\n"+"Your issue - "+shortdesc+" has been posted successfully"+
    				". The link for the concerned issue is :- http://localhost:15000/issues/";

				// Mail to user about confirmation of the issue created by him    									
				// alert('mail to user itself');
				if(author!='anonymous')
				{
					Meteor.call('sendEmail',
        	   			issueRaisedUserEmailId, 
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
						postedUserId:Meteor.userId() ,
						postedUserName: Meteor.user().username,
						read: false,
						timestamp: new Date()
					});	 
				}
						

				// alert('before loop of subscribed collection');
				listOfDomain.forEach( function(myDoc) 
				{
					//alert('myDoc.category '+myDoc.category);
					var managerCategory = myDoc.category;
					var messageToManager = "Hello "+myDoc.name+",\n\n"+"The new issue has been posted - "+shortdesc+
    					". Can you please look after this matter asap.\n\n"+
        				"The link for the concerned issue is :- http://localhost:15000/issues/"; 

					// Creating regular expression to check all possible format in which user can enter domain name
					var regEx = new RegExp("^.*"+myDoc.category+".*","gi"); 

					// Checking whether domain name is present in the detils part of the form
					if(shortdesc || location)// details || category || unit)
					{
						if(shortdesc.match(regEx) ||location.match(regEx))// || category.match(regEx) || details.match(regEx) || unit.match(regEx))
						{										
							//alert('inside regular expression');
							// Mail to manager regarding pop up of new issue
							//alert('mail to manager');
							Meteor.call('sendEmail',
								receiverEmail.emailId,  
			        			senderEmail,
			        			messageToManager,
				    			id,
								subjectOfEmail);


							// Users who have subscribed to that domain, from Subscribed collection
 		 					people = myDoc.categorySubscribedUsers;
							//alert('before person loop in details part');
							if(people && people.length)
							{
								// alert('people.length'+people.length)
								for(j=0;j<people.length;j++)
								{
									Meteor.call('getUser', people[j], function(error, person){
										if(error){
											throwError(error.reason);
										}
										else {
											// alert(people[j]);
											// alert(person);
											if(person) {
												// alert('person.username '+person.username);
												Meteor.call('user', person.username, person.emails[0].address, senderEmail, id, subjectOfEmail, person._id, shortdesc, author, function(error, result){
													if(error){
														throwError(error.reason);
													}
												});
											}
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
			Router.go('issues', id);
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
    return '' + y + '-' + (m<=9 ? '0' + m : m) + '-' + (d <= 9 ? '0' + d : d);
	},
	time: function(){
		var date = new Date();
		var hours = date.getHours();
		var min = date.getMinutes();
		return '' + (hours<=9 ? '0' + hours : hours) + ':' + (min<=9 ? '0' + min : min);
	},
	unit: function(){
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
	room: function(){
		if(Meteor.user().profile){
			return Meteor.user().profile.room;
		}
		else{
			return "";
		}
	}
});
