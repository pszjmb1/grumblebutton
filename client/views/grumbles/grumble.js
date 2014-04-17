/**
*
*Template for getting the values of the sayIt.today so that manager and subscribed users of that particular domain can be notified.
*/

//db.subscribed.update({category:'Finance', categorySubscribedUsers.username:'priya'},{$addToSet:{categorySubscribedUsers.0.issueNotToDisplay.$:'SL9NchSjbsjLF2KBb'}});
//db.subscribed.update({category:'Finance'},{$addToSet:{categorySubscribedUsers.0.issueNotToDisplay.$:'SL9NchSjbsjLF2KBb'}});


Template.grumble.events({
	'submit form': function(e) {
		//alert('grumble.js');
		e.preventDefault();
		var issue = {
			date: $(e.target).find('[name=date]').val(),
			time: $(e.target).find('[name=time]').val(),
			dept: $(e.target).find('[name=dept]').val(),
			unit: $(e.target).find('[name=unit]').val(),
			room: $(e.target).find('[name=room]').val(),
			urgency: $(e.target).find('[name=urgency]').val(),
			category: $(e.target).find('[name=category]').val(),
			shortdesc: $(e.target).find('[name=shortdesc]').val(),
			details: $(e.target).find('[name=details]').val(),
			anonymous: $(e.target).find('[name=anonymous]').val(),
		}
		
		// Getting all the field values of the form
		var details = document.querySelector('[name=details]').value;
		//alert('details '+details);
		var shortdesc = document.querySelector('[name=shortdesc]').value;
		//alert('shortdesc '+shortdesc);
		var category = document.querySelector('[name=category]').value; 
		//alert('category '+category);
		var senderEmail = 'grumblebutton@gmail.com';
		var managerCategory = Subscribed.findOne({category:category});
		//alert('a'+a);
		var user = Meteor.user();
		//alert('Meteor.user() '+user);

		// Email Id of user who has posted the issue
		var issueRaisedUserEmailId = user.emails[0].address;

		//alert('issueRaisedUserEmailId '+issueRaisedUserEmailId);

		// Manager's Email Id
		var receiverEmail = Subscribed.findOne({category:category}).emailId;

		//alert('receiverEmail '+receiverEmail);
	    var messageToManager = "Hello "+managerCategory.name+",\n\n"+"The new issue has been posted - "+shortdesc+
    	". Can you please look after this matter asap.\n\n"+
        "The link for the concerned issue is :- http://localhost:3000/issues/"; 

		var subjectOfEmail = "Notification of New Issue";
		var dept = document.querySelector('[name=dept]').value;
		//alert('dept '+dept);
		var unit = document.querySelector('[name=unit]').value; 
		//alert('unit '+ unit);
		var i,j, person='', myDocId, foundValue;

		// List of Domains present in the collection Subscribed
		var listOfDomain = Subscribed.find();
		//alert('everything is correct');

		//alert('inside grumble.js');
		//alert('before calling Meteor.call()');
		Meteor.call('grumble', issue, function(error, id) {
			if (error)
			{
			//alert('throwing error');
			throwError(error.reason); 
			}
			else
			{
				//alert('mail to manager');

				// Mail to manager regarding pop up of new issue
				Meteor.call('sendEmail',
					receiverEmail.emailId,  
			        senderEmail,
			        messageToManager,
				    id,
					subjectOfEmail);


					//alert('mail to user itself');
				var messageToUser = "Hello "+Meteor.user().username+",\n\n"+"Your issue - "+shortdesc+" has been posted successfully"+
    								". The link for the concerned issue is :- http://localhost:3000/issues/";

				// Mail to user about confirmation of the issue created by him    									
				Meteor.call('sendEmail',
        	   		issueRaisedUserEmailId, 
			        senderEmail,
			        messageToUser,
				    id,
					subjectOfEmail);

/*				Notifications.insert({
					userId: Meteor.user(), // users id who has posted the issue
					issueId: id,   // issue id
					//commentId: comment._id,
					//commenterName: comment.author,
					postedUserId:Meteor.user() ,
					postedUserName: Meteor.user().username,
					read: false
			});	 */
						

				//alert('before loop of subscribed collection');
				listOfDomain.forEach( function(myDoc) 
				{
					//alert('myDoc._id '+myDoc._id);

					// Creating regular expression to check all possible format in which user can enter domain name
					var regEx = new RegExp("^.*"+myDoc.category+".*","gi"); 

					// Checking whether domain name is present in the detils part of the form
					if(details)
					{
						if(details.match(regEx))
						{										
							alert('inside details regular expression');

							// Users who have subscribed to that domain, from Subscribed collection
 		 					person = myDoc.categorySubscribedUsers;
							//alert('before person loop in details part');
							if(person && person.length)
							{
								for(j=0;j<person.length;j++)
								{
									
									//Meteor.Router.to('issuePage', id);
									var messageToSubscribedUsers = "Hello "+person[j].username+",\n\n"+ "The new issue has been raised - " +shortdesc+
    									". The link for the concerned issue is :- http://localhost:3000/issues/";

									// Notification to all subscribed Users of that domain
									//alert('mail to subscribed users in details part ');
									//alert('senderEmail '+senderEmail);
									//alert('person[j].emails[0].address '+person[j].emails[0].address);
									//alert('messageToSubscribedUsers '+messageToSubscribedUsers);
									//alert('id '+id);
									//alert('subjectOfEmail '+subjectOfEmail)
									Meteor.call('sendEmail',
        		 	   	   				person[j].emails[0].address,  // NEED TO BE CHANGED ACCORDING TO THE USER EMAIL ID ,
	            	     				senderEmail,
	              		    			messageToSubscribedUsers,
					   		   			id,
					        	   		subjectOfEmail); 
									Notifications.insert({
										userId: person[j]._id, // users id who has posted the issue
										issueId: this._id,   // issue id
										//commentId: comment._id,
										//commenterName: comment.author,
										postedUserId:Meteor.user() ,
										postedUserName: Meteor.user().username,
										read: false
									});	
								
									// Adding an extra field in the Subscribed collection so that inspite of having multiple occurences of a domain in the form, multiple time notification to the users can be prevented
									//alert('before updating field');
									Subscribed.update(myDoc._id, {$set: {found: 1}});
										//var determine = Subscribed.findOne(myDoc._id);
										//alert('value of found field after details part ');

								}
							}
							
						}
					}
					
					// Checking whether keyword is present in shortdesc part of the form
					myDocId = Subscribed.findOne(myDoc._id);							
					foundValue = myDocId.found;
					//alert('value of foundValue '+foundValue);
					if(shortdesc)
					{
						if(!foundValue)
						{
							//alert('inside shortdesc part');
							if(shortdesc.match(regEx))
							{
								alert('category matches with shortdesc part');

								// Users who have subscribed to that domain, from Subscribed collection
 			 					person = myDoc.categorySubscribedUsers;
 			 					if(person && person.length)
								{
									//alert('before person loop in shortdesc part');
									for(j=0;j<person.length;j++)
									{

										var messageToSubscribedUsers = "Hello "+person[j].username+",\n\n"+ "The new issue has been raised - " +shortdesc+
    										". The link for the concerned issue is :- http://localhost:3000/issues/";

										// Notification to all subscribed Users
										//alert('mail to subscribed users in shortdesc part');
										Meteor.call('sendEmail',
											person[j].emails[0].address,
        	 	   	   						senderEmail,
	              	    					messageToSubscribedUsers,
					   	   					id,
					           				subjectOfEmail); 

										Notifications.insert({
											userId: person[j]._id, // users id who has posted the issue
											issueId: this._id,   // issue id
											//commentId: comment._id,
											//commenterName: comment.author,
											postedUserId:Meteor.user() ,
											postedUserName: Meteor.user().username,
											read: false
										});	

										// Adding an extra field in the Subscribed collection so that inspite of having multiple occurences of a domain in the form, multiple time notification to the users can be prevented	
										Subscribed.update(myDoc._id, {$set: {found: 1}});
										//var determine = Subscribed.findOne(myDoc._id);
										//alert('value of found field after shortdesc part '+determine.found);
									}
								}
							}
						}								
					}
					myDocId = Subscribed.findOne(myDoc._id);							
					foundValue = myDocId.found;
					// Checking whether keyword is present in rest of the part of the form
					if((category.match(regEx) ||dept.match(regEx) || unit.match(regEx)) && !foundValue)
					{
					
						alert('inside rest of the form part');
						person = myDoc.categorySubscribedUsers;
						if(person && person.length)
						{
							for(j=0;j<person.length;j++)
							{
								var messageToSubscribedUsers = "Hello "+person[j].username+",\n\n"+ "The new issue has been raised - " +shortdesc+
    								". The link for the concerned issue is :- http://localhost:3000/issues/";

								// Notification to all subscribed Users
								//alert('mail to subscribed users in rest of the form part');
								Meteor.call('sendEmail',
        	 	   	   				person[j].emails[0].address,  // NEED TO BE CHANGED ACCORDING TO THE USER EMAIL ID  person[j].emails[0].address
	                 				senderEmail,
	              	    			messageToSubscribedUsers,
					   	   			id,
					           		subjectOfEmail); 

								Notifications.insert({
										userId: person[j]._id, // users id who has posted the issue
										issueId: this._id,   // issue id
										//commentId: comment._id,
										//commenterName: comment.author,
										postedUserId:Meteor.user() ,
										postedUserName: Meteor.user().username,
										read: false
									});	

								// Adding an extra field in the Subscribed collection so that inspite of having multiple occurences of a domain in the form, multiple time notification to the users can be prevented	
								Subscribed.update(myDoc._id, {$set: {found: 1}});
								//var determine = Subscribed.findOne(myDoc._id);											
								//alert('value of found field after rest of the form field part '+determine.found);						
							}
						}
					}
						
					
			});
			
			//alert('making the found field 0 for next issue');
			
			var domainList = Subscribed.find();
			domainList.forEach( function(myDoc) 
			{

				Subscribed.update(myDoc._id, {$set: {found: 0}});
				//var determine = Subscribed.findOne(myDoc._id);											
				//alert('value of found field after rest of the form field part '+determine.found);

			});
			//alert('before Meteor.Router.to() inside grumble.js');
			Meteor.Router.to('issuePage', id);
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
	}
});
