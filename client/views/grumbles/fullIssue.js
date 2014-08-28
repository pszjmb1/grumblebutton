/**
*Template to show issue details on the page
*
*/
Template.fullIssue.events({
	'click #close': function() {
		issueId = this._id;
		Issues.update({_id: issueId}, {$set: {issueClosed: 1}});
		Router.go('closedIssues');
	},
	'click #reopen': function() {
		issueId = this._id;
		Issues.update({_id: issueId}, {$set: {issueClosed: 0}});
		Router.go('issues');
	}
// 'click #check': function () {
// 	//alert('inside fullIssue');
// 	var senderEmail = 'grumblebutton@gmail.com';
//     var userId = Meteor.user();
//     //var userName = Meteor.user().username;
//     var issue = Issues.findOne(this._id);
//     var issueRaisedUserId= issue.userId;;
//     var issueRaisedUser = issue.author;
//     var issueRaisedUserEmailId = issue.authorEmailId;
// 	var issueManagerCategory = issue.category;
// 	var managerEmailId = Subscribed.findOne({category: issueManagerCategory}).emailId;
// 	var managerName = Subscribed.findOne({category: issueManagerCategory}).name;
// 	var listOfDomain = Subscribed.find();

// 	var raisedSubscribedUserMsg = "Hello "+issueRaisedUser +",\n\n"+
//     	Meteor.user().username + ' has subscribed to your issue having issueId:- ';
    	
// 	var managerSubscribedMsg = "Hello "+ managerName +",\n\n"+
//     	Meteor.user().username + ' has subscribed to the issue belonging to your category having issueId:- ';
    		
// 	var subOfSubscribedIssue = 'Notification of Subscribed Issue';
// 	var shortdesc='', details='', regEx='', flag=0, k=0, pulled=0, person='', issueToBeUnMarked='';
// 	var category='', unit='', dept='';

// 	// Enter in this control when checkbox is checked
// 	// There can be two scenarios of checking
// 	// 1) Either user has subscribed to the domain related to this issue but previously has unsubscibed to this particular issue
// 	// 2) OR  user wants to subscribed this issue only irrespective of domain of issue
// 	if(document.getElementById('check').checked)
// 	{
// 		//alert('checked part');
// 		//Adding the username in the collection if s/he has subscribed to that issue
// 		// Flag indicates that the category of issue is present anywhere in the form
// 		flag =0;
// 		k=0;
// 		// Pulled indicates that the user has subscibed to domain of this issue but not this issue
// 		pulled =0;

// 		//alert('checked -> checking for domain');
// 		// Loop runs throughout all the issues to check subscription of domain by current user
// 		listOfDomain.forEach( function(myDoc) 
// 		{
// 			alert('checking the issue whose domain already subscribed');
// 			// checking for regular expression of the domain of the user
// 			regEx = new RegExp("^.*"+myDoc.category+".*","gi"); 
// 			details = issue.details;
// 			alert('myDoc.category '+myDoc.category);
// 			//Checking the presence of domain in details field
// 			if(details)
// 			{
// 				if(details.match(regEx))
// 				{
	 			
// 					alert('details part');
// 					// Checking the presence of current user in the subscribed list
// 					person = myDoc.categorySubscribedUsers;
// 					if(person && person.length)
// 					{
// 						//alert('person.length -> details part '+person.length);
// 						for(j=0;j<person.length;j++)
// 						{
// 							if(Meteor.user().username === person[j].username)
// 							{
// 								// update
// 								alert('loggedin user name is already there in domain collection');
// 								issueToBeUnMarked = person[j].issueNotToDisplay;
// 								if(issueToBeUnmarked && issueToBeUnmarked.length)
// 								{
// 									//alert('issueToBeUnmarked.length '+issueToBeUnmarked.length);
// 									for(k=0;k<issueToBeUnmarked;k++)
// 									{
// 										if(issueToBeUnMarked[k] === issue)
// 										{	
// 											//alert('current issue need to be marked, so pulling from collection');
// 											// Pulling of user name from unsubscibed issues list
// 											alert('checking the issue in details form part');
											
// 										/*	Subscribed.update(
// 											{
//     											"_id":Subscribed.findOne({"category": myDoc.category, "categorySubscribedUsers.username" :person[j].username})._id
// 											},
// 											{ 
//     										"$pull": {
//         										categorySubscribedUsers[j].issueNotToDisplay: issue
//     											}
// 											}
// 											)  */

// 											// If user while posting the issue has shown is identity then send mail to him
// 											if(issueRaisedUser!='anonymous')
// 											{
// 												Meteor.call('sendEmail',
//     	    		    							issueRaisedUserEmailId,
// 				    		    					senderEmail,
// 					        						raisedSubscribedUserMsg,
// 							    					issue,
// 							    					subOfSubscribedIssue);
		
// 												Notifications.insert({
// 													userId: issueRaisedUserId, 
// 													issueId: issue._id,   
													
// 													subscribedUserId:userId ,
// 													subscribedUserName:Meteor.user().username,
// 													read: false,
// 													timestamp: new Date()
// 												});	
// 											}
	
// 											// Send mail to the manager
// 											Meteor.call('sendEmail',
//         	    								managerEmailId,
// 				        						senderEmail,
// 				        						managerSubscribedMsg,
// 					    						issue,
// 					    						subOfSubscribedIssue);

// 											// Set pulled and flag for finding the domain of user in the details part of issue
// 											pulled=1;
// 											flag =1;
// 										}
// 									}
// 								}
// 							}
// 						}		
// 					}
// 				}
// 			}
// 			// Checking the presence of domain in shortdesc field
// 			//alert('inside shortdesc');
// 			if(flag ===0)
// 			{
// 				shortdesc = issue.shortdesc;
// 				if(shortdesc)
// 				{
			
// 					if(shortdesc.match(regEx))
// 					{
	 				
// 						//alert('checked ppart -> shortdesc');
// 						// Checking the presence of current user in the subscribed list
// 						person = myDoc.categorySubscribedUsers;
// 						if(person && person.length)
// 						{
// 							for(j=0;j<person.length;j++)
// 							{
// 								//alert('person.length inside shortdesc '+person.length);
// 								if(Meteor.user().username === person[j].username)
// 								{
// 									issueToBeUnMarked = person[j].issueNotToDisplay;
// 									if(issueToBeUnmarked && issueToBeUnmarked.length)
// 									{
// 										//alert('issueToBeUnmarked '+issueToBeUnmarked.length);
// 										for(k=0;k<issueToBeUnmarked;k++)
// 										{
// 											if(issueToBeUnMarked[k] === issue)
// 											{
// 												//alert('issue matched to be marked, so pulling');
// 												// Pulling of user name from unsubscibed issues list
// 												alert('checking the issue in shortdesc  form part');
// 												//Subscribed.update({"_id":Subscribed.findOne({"category": myDoc.category, "categorySubscribedUsers.username" :person[j].username})._id},{ "$pull": {categorySubscribedUsers.j.issueNotToDisplay: issue}})
// 											/*	Subscribed.update(
// 												{
//     											"_id":Subscribed.findOne({"category": myDoc.category, "categorySubscribedUsers.username" :person[j].username})._id
// 												},
// 												{	 
//     											"$pull": {
//         											categorySubscribedUsers[j].issueNotToDisplay: issue
//     												}
// 												}
// 												) */
// 												// Set pulled and flag for finding the domain of user in the details part of issue
// 												pulled=1;
// 												flag =1;
// 												// If user while posting the issue has shown is identity then send mail to him
// 												if(issueRaisedUser!='anonymous')
// 												{
// 													Meteor.call('sendEmail',
//         		    									issueRaisedUserEmailId,
// 			    		    							senderEmail,
// 					        							raisedSubscribedUserMsg,
// 							    						issue,
// 								    					subOfSubscribedIssue);
			
// 													Notifications.insert({
// 														userId: issueRaisedUserId, 
// 														issueId: issue._id,   
														
// 														subscribedUserId:userId ,
// 														subscribedUserName:Meteor.user().username,
// 														read: false,
// 														timestamp: new Date()
// 													});	
// 												}
			
// 												// Send mail to the manager
// 												Meteor.call('sendEmail',
//         	    									managerEmailId,
// 				        							senderEmail,
// 				        							managerSubscribedMsg,
// 					    							issue,
// 						    						subOfSubscribedIssue);
// 											}	
// 										}
// 									}	
// 								}
// 							}
// 						}
// 					}
// 				}
// 			}
// 			// Checking the presence of keyword in rest of the form fields
// 			if(flag ===0)
// 			{
// 				//alert('inside rest of the form part');
// 				category = issue.category;
// 				unit = issue.unit;
// 				dept = issue.dept;
// 				if((category.match(regEx) || unit.match(regEx) || dept.match(regEx)))
// 				{
				
// 					// Checking the presence of current user in the subscribed list
// 					person = myDoc.categorySubscribedUsers;
// 					for(j=0;j<person.length;j++)
// 					{
// 						if(Meteor.user().username === person[j].username)
// 						{	
// 							issueToBeUnMarked = person[j].issueNotToDisplay;
// 							if(issueToBeUnmarked && issueToBeUnmarked.length)
// 							{
// 								//alert('issueToBeUnmarked.length '+issueToBeUnmarked.length);
// 								for(k=0;k<issueToBeUnmarked;k++)
// 								{
// 									if(issueToBeUnMarked[k] === issue)
// 									{
// 										//alert('issue found to be marked, so pulling');
// 										// Pulling of user name from unsubscibed issues list
// 										alert('checking the issue in rest of the form part');
// 										//Subscribed.update({"_id":Subscribed.findOne({"category": myDoc.category, "categorySubscribedUsers.username" :person[j].username})._id},{ "$pull": {categorySubscribedUsers.j.issueNotToDisplay: issue}})
// 									/*	Subscribed.update(
// 										{
//     										"_id":Subscribed.findOne({"category": myDoc.category, "categorySubscribedUsers.username" :person[j].username})._id
// 										},
// 										{	 
//     									"$pull": {
//         									categorySubscribedUsers[j].issueNotToDisplay: issue
//     										}
// 										}
// 										) */
// 										// Set pulled and flag for finding the domain of user in the details part of issue
// 										pulled=1;
// 										flag =1;
// 										// If user while posting the issue has shown is identity then send mail to him
// 										if(issueRaisedUser!='anonymous')
// 										{
// 											Meteor.call('sendEmail',
//         		    						issueRaisedUserEmailId,
// 				   			    			senderEmail,
// 					       					raisedSubscribedUserMsg,
// 						    				issue,
// 						    				subOfSubscribedIssue);
				
// 											Notifications.insert({
// 												userId: issueRaisedUserId, 
// 												issueId: issue._id,   
														
// 												subscribedUserId:userId,
// 												subscribedUserName:Meteor.user().username,
// 												read: false,
// 												timestamp: new Date()
// 											});		
// 										}	
// 										// Send mail to the manager
// 										Meteor.call('sendEmail',
//         			    					managerEmailId,
// 						        			senderEmail,
// 						        			managerSubscribedMsg,
// 					    					issue,
// 					    					subOfSubscribedIssue);
// 									}
// 								}	
// 							}
// 						}
// 					}
// 				}
// 			}
// 		});  
// 		//alert('pulled - 0');
// 		// Checking if pulled is not set i.e. issue's domain has not been subscribed by user
// 		if(pulled ===0)
// 		{
// 			alert('checking the issue not related to any domain');
//   			Issues.update(this._id, {$addToSet: {subscribedUsers : Meteor.user()}});
// 			// Send mail to the user who has posted the issue regarding subscription of issue
// 			if(issueRaisedUser!='')
// 			{ 
// 				alert('mail sent to user');
// 				Meteor.call('sendEmail',
//         		    	issueRaisedUserEmailId,
// 			    	    senderEmail,
// 			        	raisedSubscribedUserMsg,
// 					    this._id,
// 					    subOfSubscribedIssue);
// 				alert('notification sent to user');
// 				Notifications.insert({
// 						userId: issueRaisedUserId,
// 						issueId: this._id,   
// 						//commentId: comment._id,
// 						//commenterName: comment.author,
// 						subscribedUserId:userId,
// 						subscribedUserName: Meteor.user().username,
// 						read: false,
// 						timestamp: new Date()
// 					});	

// 			}
// 			// Send mail to the manager
// 			alert('mail sent to manager');
// 			Meteor.call('sendEmail',
//         	    	managerEmailId,
// 			        senderEmail,
// 			        managerSubscribedMsg,
// 				    this._id,
// 				    subOfSubscribedIssue); 

// 			// alert('mail sent to user and manager regarding subscription by user but not domain');
// 		}
// 	}
// 	else if (!(document.getElementById('check').checked))
//   	{
//   		alert('pulling of data in fullIssue.js');
//   		// If user wants to unsubscibe from the issue
//   		// Again there are two scenarios
//   		// 1) Either user has subscibe to the issues domain and wants to unsubscibe from this issue
// 		// 2) OR user only had subscibed this issue not it's domain 
//   		person =  issue.subscribedUsers;
// 		flag=0;
// 		var raisedUnSubscribedUserMsg = "Hello "+issueRaisedUser +",\n\n"+
// 	    		Meteor.user().username + ' has unsubscribed to your issue having issueId:- ';
//     	var managerUnSubscribedMsg = "Hello "+ managerName +",\n\n"+
//     			Meteor.user().username + ' has unsubscribed to the issue belonging to your category having issueId:- ';
// 		var subOfUnSubscribedIssue = 'Notification of UnSubscribed Issue';

		
// 		if(person && person.length)
// 		{
// 			alert('checking the checked issue in Issues collection');
// 			var j;
// 			//alert('5');
// 			for(j= 0;j< person.length;j++)
// 			{
// 				if(person[j].username === Meteor.user().username)
// 				{	
// 					//alert('pulling->issues->current user matched');
// 					var personId=person[j]._id;
// 					// Removing the username from the collection if s/he has unsubscribed to that issue
// 					alert('user wants to unsubscribe from this issue');
// 					Issues.update(this._id,{$pull:{subscribedUsers:{_id:personId}}});
// 					alert('pulling->issues->current user removed');
// 					// Send mail to the user who has posted the issue regarding unsubscription by the user
// 					if(issueRaisedUser!='anonymous')
// 					{	 
// 						//alert('pulling->issues->mail to user');
// 						Meteor.call('sendEmail',
//         	    			issueRaisedUserEmailId,
// 			        		senderEmail,
// 			        		raisedUnSubscribedUserMsg,
// 				    		this._id,
// 				    		subOfUnSubscribedIssue);
// 							//alert('pulling->issues->notification to user');
// 						Notifications.insert({
// 							userId: issueRaisedUserId, // users id who has posted the issue
// 							issueId: this._id,   // issue id
// 							//commentId: comment._id,
// 							//commenterName: comment.author,
// 							unSubscribedUserId:userId ,
// 							unSubscribedUserName:Meteor.user().username,
// 							read: false,
// 							timestamp: new Date()
// 						});	
// 					}
// 					// Send mail to the manager regarding unsubscription by the user
// 					//alert('pulling->issues->mail to manager');
// 					Meteor.call('sendEmail',
//         	    		managerEmailId,
// 			        	senderEmail,
// 			        	managerUnSubscribedMsg,
// 				    	this._id,
// 				    	subOfUnSubscribedIssue); 
// 					flag =1;
// 		        	break; 
// 				}
// 			}
//    		} 
// 		if(flag ===0)   			
// 		{
// 			alert('checking the checked issue in Managers collection as user has subscribed to the domain');
// 			//alert('subscribed issue may be in managers collection');
// 			//alert('pulling->domain');
			
// 			// Checking whether current user has subscibed to the domain
// 			listOfDomain.forEach( function(myDoc) 
// 			{
// 				// Regular Expression
// 				regEx = new RegExp("^.*"+myDoc.category+".*","gi"); 
// 				alert('pulling->domain->myDoc.category '+myDoc.category);
// 				// Checking the presence of keyword in details field
// 				details = issue.details;
// 				if(details)
// 				{
// 					if(details.match(regEx))
// 					{
	 				
// 						//alert('pulling->domain->details matched');
// 						// Retrieving the subscribed user name
// 						person = myDoc.categorySubscribedUsers;
// 						if(person && person.length)
// 						{
// 							//alert('pulling->domain-> person.length'+person.length);
// 							for(j=0;j<person.length;j++)
// 							{
// 								if(Meteor.user().username === person[j].username)
// 								{
// 									// update
// 									alert('removing the issue in details part');
// 									// Showing uninterest of the current user in this particular issue of his interested domain
// 									//Subscribed.update({"_id":Subscribed.findOne({"category": myDoc.category, "categorySubscribedUsers.username" :person[j].username})._id},{ "$addToSet": {categorySubscribedUsers.j.issueNotToDisplay: issue}})

// 								/*	Subscribed.update(
// 									{
//     									"_id":Subscribed.findOne({"category": myDoc.category, "categorySubscribedUsers.username" :person[j].username})._id
// 									},
// 									{	 
//     								"$addToSet": {
//         								categorySubscribedUsers[j].issueNotToDisplay: issue
//     									}
// 									}
// 									) */
// 									//alert('pulling->domain->present issue stored in domain collection');
// 									// Send mail to the user who has posted the issue regarding unsubscription by the user
// 									if(issueRaisedUser!='anonymous')
// 									{
// 									//	alert('pulling->domain->mail to user');
// 										Meteor.call('sendEmail',
//         	    							issueRaisedUserEmailId,
// 			        						senderEmail,
// 				        					raisedUnSubscribedUserMsg,
// 					    					issue,
// 					    					subOfUnSubscribedIssue);

// 									//	alert('pulling->domain->notification to user');
// 										Notifications.insert({
// 											userId: issueRaisedUserId, // users id who has posted the issue
// 											issueId: issue._id,   // issue id
// 											//commentId: comment._id,
// 											//commenterName: comment.author,
// 											unSubscribedUserId:userId ,
// 											unSubscribedUserName: Meteor.user().username,
// 											read: false,
// 											timestamp: new Date()
// 										});	
// 									}	
					
// 									// Send mail to the manager regarding unsubscription by the user
// 									//alert('pulling->domain->mail to manager');
// 									Meteor.call('sendEmail',
//         	    						managerEmailId,
// 			        					senderEmail,
// 			        					managerUnSubscribedMsg,
// 				    					issue,
// 				    					subOfUnSubscribedIssue); 
// 										break;
// 								}
// 							}	
// 						}
// 					}
// 				}

// 				// Checking the presence of keyword in shortdesc field
// 				//alert('inside shortdesc');
// 				shortdesc = issue.shortdesc;
// 				if(shortdesc)
// 				{
			
// 					if(shortdesc.match(regEx))
// 					{
	 			
// 						//alert('pulling->domain->shortdesc');
// 						// Retrieving the subscribed user name
// 						person = myDoc.categorySubscribedUsers;
// 						if(person && person.length)
// 						{
// 							//alert('pulling->domain->shortdesc->person.length '+person.length);
// 							for(j=0;j<person.length;j++)
// 							{
// 								if(Meteor.user().username === person[j].username)
// 								{
// 									// update
// 									// alert('before updating the subscribed collection about notto displayed issues in shortdesc part');
// 									// alert('pulling->domain->shortdesc->current user found on domain collection ');
// 									// Showing uninterest of the current user in this particular issue of his interested domain
// 									alert('removing the issue in shortdesc part');
// 									//Subscribed.update({"_id":Subscribed.findOne({"category": myDoc.category, "categorySubscribedUsers.username" :person[j].username})._id},{ "$addToSet": {categorySubscribedUsers.j.issueNotToDisplay: issue}})
// 								/*	Subscribed.update(
// 									{
//     									"_id":Subscribed.findOne({"category": myDoc.category, "categorySubscribedUsers.username" :person[j].username})._id
// 									},
// 									{	 
//     								"$addToSet": {
//         								categorySubscribedUsers[j].issueNotToDisplay: issue
//     									}
// 									}
// 									) */

// 									// Send mail to the user who has posted the issue regarding unsubscription by the user
// 									if(issueRaisedUser!='anonymous')
// 									{
// 										//alert('pulling->domain->shortdesc->mail sent to user');
// 										Meteor.call('sendEmail',
//         	    							issueRaisedUserEmailId,
// 				        					senderEmail,
// 				        					raisedUnSubscribedUserMsg,
// 					    					issue,
// 					    					subOfUnSubscribedIssue);

// 										//alert('pulling->domain->shortdesc->notification sent to user');
// 										Notifications.insert({
// 											userId: issueRaisedUserId, // users id who has posted the issue
// 											issueId: issue._id,   // issue id
// 											//commentId: comment._id,
// 											//commenterName: comment.author,
// 											unSubscribedUserId:userId,
// 											unSubscribedUserName: Meteor.user().username,
// 											read: false,
// 											timestamp: new Date()
// 										});	
// 									}
					
// 									// Send mail to the manager regarding unsubscription by the user
// 									// alert('pulling->domain->shortdesc->mail sent to manager');
// 									Meteor.call('sendEmail',
//         	    						managerEmailId,
// 			        					senderEmail,
// 			        					managerUnSubscribedMsg,
// 				    					issue,
// 				    					subOfUnSubscribedIssue); 
// 									break;
// 								}
// 							}	
// 						}
// 					}
// 				}
		
// 				if((issue.category).match(regEx) || (issue.unit).match(regEx) || (issue.dept).match(regEx))
// 				{
// 					//alert('inside pulling->domain->rest of form ');
// 					// Retrieving the subscribed user name
// 					person = myDoc.categorySubscribedUsers;
				
// 					if(person && person.length)
// 					{
// 						//alert('inside pulling->domain->rest of form->person.length '+person.length);
// 						for(j=0;j<person.length;j++)
// 						{
// 							if(Meteor.user().username === person[j].username)
// 							{
// 								//alert('inside pulling->domain->rest of form-> current user found in collection');
// 								//update
// 								//	alert('before updating the subscribed collection about not to displayed issues in rest of the form part');
// 								// Showing uninterest of the current user in this particular issue of his interested domain
// 								alert('removing the issue in rest of the form part');
// 								//Subscribed.update({"_id":Subscribed.findOne({"category": myDoc.category, "categorySubscribedUsers.username" :person[j].username})._id},{ "$addToSet": {categorySubscribedUsers.j.issueNotToDisplay: issue}})
// 							/*	Subscribed.update(
// 								{
//     								"_id":Subscribed.findOne({"category": myDoc.category, "categorySubscribedUsers.username" :person[j].username})._id
// 								},
// 								{	 
//     							"$addToSet": {
//         							categorySubscribedUsers[j].issueNotToDisplay: issue
//     								}
// 								}
// 								) */
// 								//alert('inside pulling->domain->rest of form->updated subscribed collection ');
// 								// Send mail to the user who has posted the issue regarding unsubscription by the user
// 								if(issueRaisedUser!='anonymous')							
// 								{
// 									//alert('inside pulling->domain->rest of form->mail sent to user ');
// 									Meteor.call('sendEmail',
//         	    						issueRaisedUserEmailId,
// 					        			senderEmail,
// 						        		raisedUnSubscribedUserMsg,
// 							    		issue,
// 							    		subOfUnSubscribedIssue);

// 									//alert('inside pulling->domain->rest of form->notification sent to user ');
// 									Notifications.insert({
// 										userId: issueRaisedUserId, // users id who has posted the issue
// 										issueId: issue._id,   // issue id
// 										//commentId: comment._id,
// 										//commenterName: comment.author,
// 										unSubscribedUserId:userId,
// 										unSubscribedUserName:Meteor.user().username,
// 										read: false,
// 										timestamp: new Date()
// 									});		
// 								}	
						
// 								// Send mail to the manager regarding unsubscription by the user
// 								//alert('inside pulling->domain->rest of form->mail sent to manager ');
// 								Meteor.call('sendEmail',
//         	    					managerEmailId,
// 			        				senderEmail,
// 			        				managerUnSubscribedMsg,
// 						    		issue,
// 						    		subOfUnSubscribedIssue); 
// 							}
// 						}
// 					}	
// 				}
// 			});	  
// 		}	
// 	}

// 	}	 
});
   

// For getting user specific subscribed issues
Template.fullIssue.done_checkbox = function () {
	// alert('inside done_checkbox');
	var issue = Issues.findOne(this._id);
	var listOfDomain = Subscribed.find();
	var details = issue.details;
	// alert('det '+details);
	var shortdesc = issue.shortdesc;
	// alert('shortdesc '+shortdesc);
	var unit = issue.unit;
	//alert('unit '+unit );
	var dept = issue.dept;
	// alert('dept '+dept);
	var category = issue.category;
	// alert('category '+category);
	var ch='';
	// Set value of unmarked represents user does not want to mark this particular issue
	var flag=0, unmarked=0, regEx='', issueToBeUnmarked='', person='';

	// Checking the current issue domain  by the current user
	listOfDomain.forEach( function(myDoc) 
	{
		// alert('domain part of fullIssue.js');
		// Creating regular expression to check all possible format in which user can enter domain name
		regEx = new RegExp("^.*"+myDoc.category+".*","gi"); 
		// alert('myDoc.category '+myDoc.category);
		// Checking whether domain name is present in the detils part of the form
		if(details)
		{
			if(details.match(regEx))
			{											
				// alert('inside details regular expression');
				// Users who have subscribed to that domain, from Subscribed collection
 		 		person = myDoc.categorySubscribedUsers;
				// alert('before person loop in details part');
				if(person && person.length)
				{
					// alert('person.length '+person.length);
					for(j=0;j<person.length;j++)
					{
						// alert('person[j].username'+person[j].username);
						// alert('Meteor.user().username '+Meteor.user().username);
						if(Meteor.userId() === person[j]._id)
						{									
							// alert('value is matched with the loggedin user');
							issueToBeUnmarked = person[j].issueNotToDisplay;
							// alert('issueToBeUnmarked.length '+issueToBeUnmarked.length);
							if(issueToBeUnmarked && issueToBeUnmarked.length)
							{
								// alert('issueToBeUnmarked.length '+issueToBeUnmarked.length);
								// Returning set value of unmarked to indicate that current user has unsubscibed from this issue not from it's domain
								for(var k=0;k<issueToBeUnmarked.length;k++)
								{
									if(issueToBeUnmarked[k] === issue)
									{
										 alert('issue matched not to be displayed in details');
										unmarked=1;
										// alert('value of unmarked in details is set');
										break;
										}
									}		
								} 
								if(unmarked ===1)
								{
									ch='';
									// alert('as unmarked is set -> so is ch = "" ');
									flag =1;
									//alert('value of ch that is set for subscribed collection inside detres block'+ch);
									break;
								}
								else
									ch = '1';
								
							}									
							
						}
						//alert('value of ch '+ ch);

					} 
				}
			}
			// Checking whether keyword is present in shortdesc part of the form
			if(flag ===0)
			{
				if(shortdesc)
				{
					if(shortdesc.match(regEx))
					{
						// alert('category matches with shortdesc part');

						// Users who have subscribed to that domain, from Subscribed collection
 						person = myDoc.categorySubscribedUsers;
 						if(person && person.length)
						{
							// alert('person.length '+person.length);
							// alert('before person loop in shortdesc part');
							for(j=0;j<person.length;j++)
							{

								if(Meteor.userId() === person[j]._id)
								{									
									issueToBeUnmarked = person[j].issueNotToDisplay;
									
									if(issueToBeUnmarked && issueToBeUnmarked.length)
									{
										// alert('issueToBeUnmarked.length '+issueToBeUnmarked.length);
										for(var k=0;k<issueToBeUnmarked.length;k++)
										{
											if(issueToBeUnmarked[k] === issue)
											{
												// Returning set value of unmarked to indicate that current user has unsubscibed from this issue not from it's domain
												 alert('issue matche for not to be displayed in shortdesc');
												unmarked=1;
												// alert('unmarked set to one in shortdesc');
												break;
											}
										}	
									} 
									if(unmarked ===1)
									{
										ch='';
										flag =1;
										// alert('value of ch ="" for shortdesc');
										break;
									}
									else
										ch = '1';
								}
								
							}
							//alert('value of ch '+ ch);
								
						}
					}
				}
			}								
			
			
			// Checking whether keyword is present in rest of the part of the form
			if(category.match(regEx) ||dept.match(regEx) || unit.match(regEx) && flag ===0)
			{
					
				// alert('inside rest of the form part');
				person = myDoc.categorySubscribedUsers;
				if(person && person.length)
				{
					// alert('person.length in rest of the part'+person.length);
					for(j=0;j<person.length;j++)
					{
						if(Meteor.userId() === person[j]._id)
						{	
							issueToBeUnmarked = person[j].issueNotToDisplay;
							
							if(issueToBeUnmarked && issueToBeUnmarked.length)
							{						
								// alert('issueToBeUnmarked.length in rest of the part '+issueToBeUnmarked.length);
								for(var k=0;k<issueToBeUnmarked.length;k++)
								{
									if(issueToBeUnmarked[k] === issue)
									{
										// Returning set value of unmarked to indicate that current user has unsubscibed from this issue not from it's domain
										alert('isue matched with not to be displayed in rest of the part');
										unmarked=1;
										// alert('unmarked set to one in rest of the form part');
										break;
									}
								}	
							} 
							if(unmarked ===1)
							{
								ch='';
								flag =1;
								// alert('value of ch = "" in rest of the form');
								break;
							}
							else
								ch = '1';
							
						}
						//alert('value of ch '+ ch);
					}				
				}
			} 
		});
			

	// Checking whether user has subscribed to that issue only and not to whole domain/keyword.
	// Returning 'checked'/ '' depending upon user has already subscribed to the issue.
	if(!ch && !flag)
	{
		// alert('issues part of fullissue.js');	
		// Retrieving the users who have subscribed to this issue
		person =  issue.subscribedUsers;
		if(person && person.length )
		{
			var j;

			for(j= 0;j< person.length;j++)
			{
				// alert('j '+j);
				// alert('person '+person[j].username);
				// If current user name is found in the subscibed user's name then return check
				if(Meteor.userId() === person[j]._id)
				{	
					ch ="checked";
					// alert('value of ch that is set of issues part'+ch);
					break; 
				}
			}
			if(ch=== 'checked')
			{
				// alert('while returning value in if block of issues part');
				return 'checked="checked"';
			}
			else		
			{
				// alert('while returning value in else block of issues part');
				return '';
			}
		}	
		else
		{
				// alert('while returning value in else block of issues part');
				return '';
		}
	}
	else if(!ch && flag ===1 )
		return '';
	else if(ch && !flag)
		return 'checked="checked"';
	
	
}; 
 
 


