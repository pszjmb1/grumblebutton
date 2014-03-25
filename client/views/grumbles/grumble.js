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
		var det = document.querySelector('[name=details]').value;
		var detres = det.split(" ");
		var shortdesc = document.querySelector('[name=shortdesc]').value;
		var shortdescres = shortdesc.split(" ");
		var msg = document.querySelector('[name=shortdesc]').value;
		var category = document.querySelector('[name=category]').value; 
		var fromEmail = 'grumblebutton@gmail.com';
		var a = Managers.findOne({category:category});
		var toEmail = Managers.findOne({category:category});
	    var messageToManager = "Hello "+a.name+",\n\n"+"The new issue has been posted - "+msg+
    	". Can you please look after this matter asap.\n\n"+
        "The link for the concerned issue is :- http://localhost:3000/issues/"; 	
		var subject = "Notification of New Issue";
		var dept = document.querySelector('[name=dept]').value;
		var unit = document.querySelector('[name=unit]').value; 
		var i,j, flag =0;
		var listOfDomain = Managers.find();

		//var issuesId ='';
		//alert('issuesId '+issuesId);
		/*for (var i=0; i < detres.length; i++)
 		   print(detres[i] + " / ");
		}*/

		/*for (var j=0; j < shortdescres.length; j++)
 		   print(shortdescres[j] + " / ");
		}*/


		Meteor.call('grumble', issue, function(error, id) {
					if (error)
						throwError(error.reason); 
					else
					{
						Meteor.call('sendEmail',
							toEmail.emailId,  // NEED TO BE CHANGED ACCORDING TO THE USER EMAIL ID
			        		fromEmail,
			                messageToManager,
				           	id,
					        subject);
						//Meteor.Router.to('issuePage', id);

						listOfDomain.forEach( function(myDoc) 
						{
							
							for (var i=0; i < detres.length; i++)
							{
								if(detres[i] ===myDoc.category)
								{
 		 							var person = myDoc.categorySubscribedUsers;

									if(person && person.length)
									{
										for(j=0;j<person.length;j++)
										{
											//Meteor.Router.to('issuePage', id);
		
											var messageToSubscribedUsers = "Hello "+person[j].username+",\n\n"+ "The new issue has been raised - " +msg+
    											". The link for the concerned issue is :- http://localhost:3000/issues/";

											// Notification to all subscribed Users
											Meteor.call('sendEmail',
        	 	   	   							'arora.priya4172@gmail.com',  // NEED TO BE CHANGED ACCORDING TO THE USER EMAIL ID
	                 							fromEmail,
	              	    						messageToSubscribedUsers,
					   	   						id,
					           					subject); 
						
											if(Meteor.user().username === person[j].username)	
											{
												var messageToUser = "Hello "+Meteor.user().username+",\n\n"+"Your issue - "+msg+" has been posted successfully"+
    												". The link for the concerned issue is :- http://localhost:3000/issues/";
	
												//Notification to that user itself
							
												Meteor.call('sendEmail',
        	    		   							'arora.priya4172@gmail.com',  // NEED TO BE CHANGED ACCORDING TO THE USER EMAIL ID
			                  						fromEmail,
			                   						messageToUser,
				           	   						id,
					           						subject);
											}
										}
									}
									flag=1;
								}
								if(flag ===1)
									break;
							}

							if(flag ===0)
							{
								for (var i=0; i < shortdescres.length; i++)
								{
									if(shortdescres[i] ===myDoc.category)
									{
 		 								var person = myDoc.categorySubscribedUsers;

										if(person && person.length)
										{
											for(j=0;j<person.length;j++)
											{
												//Meteor.Router.to('issuePage', id);
			
												var messageToSubscribedUsers = "Hello "+person[j].username+",\n\n"+ "The new issue has been raised - " +msg+
    												". The link for the concerned issue is :- http://localhost:3000/issues/";

												// Notification to all subscribed Users
												Meteor.call('sendEmail',
        	 	   	   								'arora.priya4172@gmail.com',  // NEED TO BE CHANGED ACCORDING TO THE USER EMAIL ID
	                 								fromEmail,
	              	    							messageToSubscribedUsers,
					   	   							id,
					           						subject); 
						
												if(Meteor.user().username === person[j].username)	
												{
													var messageToUser = "Hello "+Meteor.user().username+",\n\n"+"Your issue - "+msg+" has been posted successfully"+
    													". The link for the concerned issue is :- http://localhost:3000/issues/";
	
													//Notification to that user itself
							
													Meteor.call('sendEmail',
        	    		   								'arora.priya4172@gmail.com',  // NEED TO BE CHANGED ACCORDING TO THE USER EMAIL ID
			                  							fromEmail,
			                   							messageToUser,
				           	   							id,
					           							subject);
												}
											}
										}
										flag=1;
									}
									if(flag ===1)
										break;
								}
							}								


							//if(category === nextCategory.category | dept === nextCategory.category | unit === nextCategory.category)
							if((category === myDoc.category || dept === myDoc.category || unit === myDoc.category) && flag ===0)
							{
					
								var person = myDoc.categorySubscribedUsers;
								if(person && person.length)
								{
									for(j=0;j<person.length;j++)
									{
										//Meteor.Router.to('issuePage', id);
		
										var messageToSubscribedUsers = "Hello "+person[j].username+",\n\n"+ "The new issue has been raised - " +msg+
    											". The link for the concerned issue is :- http://localhost:3000/issues/";

										// Notification to all subscribed Users
										Meteor.call('sendEmail',
        	 	   	   						'arora.priya4172@gmail.com',  // NEED TO BE CHANGED ACCORDING TO THE USER EMAIL ID
	                 						fromEmail,
	              	    					messageToSubscribedUsers,
					   	   					id,
					           				subject); 
						
										if(Meteor.user().username === person[j].username)	
										{
											var messageToUser = "Hello "+Meteor.user().username+",\n\n"+"Your issue - "+msg+" has been posted successfully"+
    											". The link for the concerned issue is :- http://localhost:3000/issues/";
	
											//Notification to that user itself
							
											Meteor.call('sendEmail',
        	    		   						'arora.priya4172@gmail.com',  // NEED TO BE CHANGED ACCORDING TO THE USER EMAIL ID
			                  					fromEmail,
			                   					messageToUser,
				           	   					id,
					           					subject);
										}
									}
								}
							}	 
						});	

											
				Meteor.Router.to('issuePage', id);
									
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
