/**
*Template to show issue details on the page
*
*/
Template.fullIssue.helpers({
	notAnon: function(author){
		if(author != 'anonymous')
			return true;
		else return false
	}
});

Template.fullIssue.events({
	'click #close': function() {
		Meteor.call('toggleIssueClosed', this._id, 1, function(error) {
			if(error){
				throwError(error.reason || "Unknown error closing issue");
			}
		});
		notifySubscribed("close", this._id);
		Router.go('closedIssues');
	},
	'click #reopen': function() {
		Meteor.call('toggleIssueClosed', this._id, 0, function(error) {
			if(error){
				throwError(error.reason || "Unknown error opening issue");
			}
		});
		notifySubscribed("open", this._id);
		Router.go('issues');
	}
	/*	'click #check': function () {
		var senderEmail = 'grumblebutton@gmail.com';
		var userId = Meteor.userId();
		var userName = Meteor.user().profile.addressing;
		var issue = Issues.findOne(this._id);
		var issueRaisedUserId= issue.userId;;
		var issueRaisedUser = issue.postedUser;
		var listOfDomain = Subscribed.find();

		var raisedSubscribedUserMsg = "Hello "+issueRaisedUser +",\n\n"+
    		username + ' has subscribed to your issue having issueId:- ';
    	
		var managerSubscribedMsg = "Hello,\n\n"+
    	username + ' has subscribed to the issue belonging to your category having issueId:- ';
    		
		var subOfSubscribedIssue = 'Notification of Subscribed Issue';
		var regEx='', flag=0, k=0, pulled=0, person='', issueToBeUnMarked='';
		var shortdesc= issue.shortdesc;
		var details= issue.details; 
		var location= issue.location;

		// Enter in this control when checkbox is checked
		// There can be two scenarios of checking
		// 1) Either user has subscribed to the domain related to this issue but previously has unsubscibed to this particular issue
		// 2) OR  user wants to subscribed this issue only irrespective of domain of issue
		if(document.getElementById('check').checked)
		{
			//Adding the username in the collection if s/he has subscribed to that issue
			// Flag indicates that the category of issue is present anywhere in the form
			flag =0;
			k=0;
			// Pulled indicates that the user has subscibed to domain of this issue but not this issue
			pulled =0;

			// Loop runs throughout all the issues to check subscription of domain by current user
			listOfDomain.forEach( function(myDoc) 
			{
				// checking for regular expression of the domain of the user
				regEx = new RegExp("^.*"+myDoc.category+".*","gi"); 
				//Checking the presence of domain in details field
				if(details || location || shortdesc)
			{
				if(shortdesc.match(regEx) || details.match(regEx) || location.match(regEx))
				{
					// Checking the presence of current user in the subscribed list
					person = myDoc.categorySubscribedUsers;
					if(person && person.length)
					{
						for(j=0;j<person.length;j++)
						{
							if(Meteor.userId() === person[j])
							{
								// update
								issueToBeUnMarked = person[j].issueNotToDisplay;
								if(issueToBeUnmarked && issueToBeUnmarked.length)
								{
									for(k=0;k<issueToBeUnmarked;k++)
									{
										if(issueToBeUnMarked[k] === issue)
										{	
											// Pulling of user name from unsubscibed issues list
											Subscribed.update(
											{
    											"_id":Subscribed.findOne({"category": myDoc.category, "categorySubscribedUsers" :person[j])._id
											},
											{ 
    											"$pull": {
        											categorySubscribedUsers[j].issueNotToDisplay: issue
    											}
											})

											// If user while posting the issue has shown is identity then send mail to him
											Meteor.call('sendEmail',
   	    		    							issueRaisedUserId,
			    		    					senderEmail,
				        						raisedSubscribedUserMsg,
						    					issue,
						    					subOfSubscribedIssue, 
												function(error) {
													if(error){
														throwError(error.reason || "Unknown error sending email");
													}
												}
											);

											Notifications.insert({
												userId: issueRaisedUserId, 
												issueId: issue._id,   
												subscribedUserId:userId ,
												subscribedUserName:Meteor.user().username,
												read: false,
												timestamp: new Date()
											});	
	
											// Send mail to the manager
											Meteor.call('sendEmail',
        	    								managerId,
				        						senderEmail,
				        						managerSubscribedMsg,
					    						issue,
					    						subOfSubscribedIssue, 
												function(error) {
													if(error){
														throwError(error.reason || "Unknown error");
													}
												}
											);

											// Set pulled and flag for finding the domain of user in the details part of issue
											pulled=1;
											flag =1;
										}
									}
								}
							}
						}		
					}
				}
			}
		});  
		// Checking if pulled is not set i.e. issue's domain has not been subscribed by user
		if(pulled ===0)
		{
  			Issues.update(this._id, {$addToSet: {subscribedUsers : Meteor.userId()}});
			// Send mail to the user who has posted the issue regarding subscription of issue
			if(issueRaisedUser!='')
			{ 
				Meteor.call('sendEmail',
       		    	issueRaisedUserId,
		    	    senderEmail,
		        	raisedSubscribedUserMsg,
				    this._id,
				    subOfSubscribedIssue
				);

				Notifications.insert({
					userId: issueRaisedUserId,
					issueId: this._id,   
					subscribedUserId:userId,
					subscribedUserName: Meteor.user().profile.addressing,
					read: false,
					timestamp: new Date()
				});	
			}
			// Send mail to the manager
			Meteor.call('sendEmail',
       	    	managerId,
		        senderEmail,
		        managerSubscribedMsg,
			    this._id,
			    subOfSubscribedIssue
			); 
		}
	}
	else if (!(document.getElementById('check').checked))
  	{
  		// If user wants to unsubscibe from the issue
  		// Again there are two scenarios
  		// 1) Either user has subscibe to the issues domain and wants to unsubscibe from this issue
		// 2) OR user only had subscibed this issue not it's domain 
  		person =  issue.subscribedUsers;
		flag=0;
		var raisedUnSubscribedUserMsg = "Hello "+issueRaisedUser +",\n\n"+
    		Meteor.user().username + ' has unsubscribed to your issue having issueId:- ';
    	var managerUnSubscribedMsg = "Hello "+ managerName +",\n\n"+
   			Meteor.user().username + ' has unsubscribed to the issue belonging to your category having issueId:- ';
		var subOfUnSubscribedIssue = 'Notification of UnSubscribed Issue';
		
		if(person && person.length)
		{
			var j;
			for(j= 0;j< person.length;j++)
			{
				if(person[j] == Meteor.userId())
				{	
					var personId=person[j];
					// Removing the username from the collection if s/he has unsubscribed to that issue
					Issues.update(this._id,{$pull:{subscribedUsers:{_id:personId}}});

					// Send mail to the user who has posted the issue regarding unsubscription by the user
					Meteor.call('sendEmail',
       	    			issueRaisedUserId,
		        		senderEmail,
		        		raisedUnSubscribedUserMsg,
			    		this._id,
			    		subOfUnSubscribedIssue);

					Notifications.insert({
						userId: issueRaisedUserId, // users id who has posted the issue
						issueId: this._id,   // issue id
						unSubscribedUserId:userId ,
						unSubscribedUserName:Meteor.user().username,
						read: false,
						timestamp: new Date()
					});	

					// Send mail to the manager regarding unsubscription by the user
					Meteor.call('sendEmail',
        	    		managerId,
			        	senderEmail,
			        	managerUnSubscribedMsg,
				    	this._id,
				    	subOfUnSubscribedIssue
				    );

					flag =1;
		        	break; 
				}
			}
   		} 
		if(flag ===0)   			
		{
			// Checking whether current user has subscibed to the domain
			listOfDomain.forEach( function(myDoc) 
			{
				// Regular Expression
				regEx = new RegExp("^.*"+myDoc.category+".*","gi"); 
				// Checking the presence of keyword in details field
				if(details || location || shortdesc)
				{
					if(shortdesc.match(regEx) || details.match(regEx) || location.match(regEx))
					{
						// Retrieving the subscribed user name
						person = myDoc.categorySubscribedUsers;
						if(person && person.length)
						{
							for(j=0;j<person.length;j++)
							{
								if(Meteor.userId() == person[j])
								{
									// update
									// Showing uninterest of the current user in this particular issue of his interested domain
									Subscribed.update(
									{
    									"_id":Subscribed.findOne({"category": myDoc.category, "categorySubscribedUsers.username" :person[j].username})._id
									},
									{	 
    								"$addToSet": {
        								categorySubscribedUsers[j].issueNotToDisplay: issue
    									}
									}
									)
									// Send mail to the user who has posted the issue regarding unsubscription by the user
									Meteor.call('sendEmail',
       	    							issueRaisedUserId,
		        						senderEmail,
			        					raisedUnSubscribedUserMsg,
				    					issue,
				    					subOfUnSubscribedIssue
				    				);

									Notifications.insert({
										userId: issueRaisedUserId, // users id who has posted the issue
										issueId: issue._id,   // issue id
										unSubscribedUserId:userId ,
										unSubscribedUserName: Meteor.user().username,
										read: false,
										timestamp: new Date()
									});	
									
									// Send mail to the manager regarding unsubscription by the user
									Meteor.call('sendEmail',
        	    						managerId,
			        					senderEmail,
			        					managerUnSubscribedMsg,
				    					issue,
				    					subOfUnSubscribedIssue
				    				); 
									break;
								}
							}	
						}
					}
				}
			});	  
		}	
	}
}*/
});

// For getting user specific subscribed issues
Template.fullIssue.done_checkbox = function () 
{
	var issue = Issues.findOne(this._id);
	var listOfDomain = Subscribed.find();
	var details = issue.details;
	var location = issue.location;
	var ch = '';
	// Set value of unmarked represents user does not want to mark this particular issue
	var regEx='', person='';

	// Checking the current issue domain  by the current user
	listOfDomain.forEach(function(myDoc)
	{
		// Creating regular expression to check all possible format in which user can enter domain name
		regEx = new RegExp("^.*"+myDoc.category+".*","gi"); 
		// Checking whether domain name is present in the detils part of the form
		if(details || location)
		{
			if(details.match(regEx) || location.match(regEx))
			{
				// Users who have subscribed to that domain, from Subscribed collection
				person = myDoc.categorySubscribedUsers;
				if(person && person.length)
				{
					for(j=0;j<person.length;j++)
					{
						if(Meteor.userId() == person[j])
						{
							ch = '';
							break;
						}
						else ch = '1';
					}
				}
			}
		}
	});

	// Checking whether user has subscribed to that issue only and not to whole domain/keyword. Returning 'checked'/ '' depending upon user has already subscribed to the issue.
	if(ch !== '')
	{
		// Retrieving the users who have subscribed to this issue
		person =  issue.subscribedUsers;
		if(person && person.length )
		{
			var j;
			for(j= 0;j< person.length;j++)
			{
				// If current user name is found in the subscibed user's name then return check
				if(Meteor.userId() == person[j])
				{	
					ch = "checked";
					break;
				}
			}
			if(ch == 'checked') {
				return 'checked="checked"';
			}
			else return '';
		}
		else return '';
	}
	else return 'checked="checked"';
};

var notifySubscribed = function(type, issueId){
	var issueUserId = Issues.findOne(issueId).userId;
	var id = issueId;
	var senderEmail = 'grumblebutton@gmail.com';
	var details = Issues.findOne(issueId).details;
	var shortdesc = Issues.findOne(issueId).shortdesc;
	var location = Issues.findOne(issueId).location;
	var subjectOfEmail = "Opening of Issue";
	var person='', regEx='';

    // Mail to user who has posted the issue regarding it's opening
	var userMessage = "";
	if(type =="open") {
		userMessage = "Hello,\n\n"+   
			". The following issue has been opened - "+shortdesc +".\n\n"+
			"The link for the concerned issue is :- http://localhost:15000/issues/";
	} else {
		userMessage = "Hello,\n\n"+   
			". The following issue has been closed - "+shortdesc +".\n\n"+
			"The link for the concerned issue is :- http://localhost:15000/closedIssues/";
	}
       
	Meteor.call('sendEmail',
		issueUserId,
	    senderEmail,
	    userMessage,
	    id,
	    subjectOfEmail, 
	    function(error) {
			if(error){
				throwError(error.reason || "Unknown error sending email");
			}
		}
	); 

	if (type == "open"){ 
		Meteor.call('createOpenNotification', issueUserId, id, function(error) {
			if(error){
				throwError(error.reason || "Unknown error creating notification");
			}
		});
	}
	else {
		Meteor.call('createCloseNotification', issueUserId, id, function(error) {
			if(error){
				throwError(error.reason || "Unknown error creating notification");
			}
		});
	}

	// Mail to users who have subscribed to this issue
	/*if(Issues.findOne(this._id).subscribedUsers)
	{
		var subscribedPerson = Issues.findOne(this._id).subscribedUsers;
		if(subscribedPerson && subscribedPerson.length)
		{
			for(i=0;i<subscribedPerson.length;i++)
			{
				var subscribedUserMessage = "Hello "+subscribedPerson[i].profile.addressing+",\n\n"+
					". The following issue has been opened - "+shortdesc +".\n\n"+
					"The link for the concerned issue is :- http://localhost:15000/closedIssues/";
				Meteor.call('sendEmail',
       	    	   	subscribedPerson[i],
		            senderEmail,
	    	        subscribedUserMessage,
		    	    this._id,
					subjectOfEmail); 
					Meteor.call('createOpenNotification', subscribedPerson[i], this._id);
			}
		}
	}*/
	// Mail to user who has subscribed to domain but not to this issue
	var listOfDomain = Subscribed.find();
	listOfDomain.forEach( function(myDoc) 
	{
		// Creating regular expression to check all possible format in which user can enter domain name
		regEx = new RegExp("^.*"+myDoc.category+".*","gi"); 
		// Checking whether domain name is present in the details part of the form
		if(details.match(regEx) || location.match(regEx))
		{										
			// Users who have subscribed to that domain, from Subscribed collection
	 		person = myDoc.categorySubscribedUsers;
			if(person && person.length)
			{
				for(j=0;j<person.length;j++)
				{
					// Notification to all subscribed Users of that domain
					Meteor.call('sendEmail',
						person[j],
						senderEmail,
						userMessage,
						id,
						subjectOfEmail, 
						function(error) {
							if(error){
								throwError(error.reason || "Unknown error sending email");
							}
						}
					); 
						
					if(type == "open")
						Meteor.call('createOpenNotification', person[j], id, function(error) {
							if(error){
								throwError(error.reason || "Unknown error creating notification");
							}
						});
					else
						Meteor.call('createCloseNotification', person[j], id, function(error) {
							if(error){
								throwError(error.reason || "Unknown error creating notification");
							}
						});
				}
				// Adding an extra field in the Subscribed collection so that inspite of having multiple occurences of a domain in the form, multiple time notification to the users can be prevented
				Meteor.call('markUnfound', myDoc._id, function(error) {
					if(error){
						throwError(error.reason || "Unknown error markUnfound");
					}
				});
			}
		}
	});			
	// Making the found field to be 0 for to be use next time
	listOfDomain.forEach( function(myDoc) 
	{
		Meteor.call('markFound', myDoc._id, function(error) {
			if(error){
				throwError(error.reason || "Unknown error markFound");
			}
		});
	});
	Meteor.call('setDefaultValue', function(error) {
		if(error){
			throwError(error.reason || "Unknown error resetting values");
		}
	});
}