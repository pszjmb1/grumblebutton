/**
*Template to show issue details on the page
*
*/

Template.fullIssue.events({
'click #gg': function () {
	alert('inside fullIssue.js - > events -> function');
	//alert('inside fullIssue');

	//alert('1');
	var senderEmail = 'grumblebutton@gmail.com';
    var userId = Meteor.user();
    var userName = userId.username;
    var issueRaisedUserId= Issues.findOne(this._id).userId;;
    var issueRaisedUser = Issues.findOne(this._id).author;
    var issueRaisedUserEmailId = Issues.findOne(this._id).authorEmailId;
	var issueManagerCategory = Issues.findOne(this._id).category;
	var managerEmailId = Subscribed.findOne({category: issueManagerCategory}).emailId;
	var managerName = Subscribed.findOne({category: issueManagerCategory}).name;

	// Determining whether checkbox has been checked or not
	if(document.getElementById('gg').checked)
	{
		//alert('inserting of data in issues collection');
		// Adding the username in the collection if s/he has subscribed to that issue
  		Issues.update(this._id, {$addToSet: {subscribedUsers : Meteor.user()}});
		var raisedSubscribedUserMsg = "Hello "+issueRaisedUser +",\n\n"+
    		userName + ' has subscribed to your issue having issueId:- ';
    	
    	var managerSubscribedMsg = "Hello "+ managerName +",\n\n"+
    		userName + ' has subscribed to the issue belonging to your category having issueId:- ';
    	
		var subOfSubscribedIssue = 'Notification of Subscribed Issue';

		// Send mail to the user who has posted the issue regarding subscription of issue
		if(issueRaisedUser!='')
		{ 
		
			Meteor.call('sendEmail',
        	    	issueRaisedUserEmailId,
			        senderEmail,
			        raisedSubscribedUserMsg,
				    this._id,
				    subOfSubscribedIssue);
			Notifications.insert({
					userId: issueRaisedUserId, // users id who has posted the issue
					issueId: this._id,   // issue id
					//commentId: comment._id,
					//commenterName: comment.author,
					subscribedUserId:Meteor.user() ,
					subscribedUserName: Meteor.user().username,
					read: false
				});	

		}
	
		// Send mail to the manager
		Meteor.call('sendEmail',
        	    	managerEmailId,
			        senderEmail,
			        managerSubscribedMsg,
				    this._id,
				    subOfSubscribedIssue); 
	}
	else if (!(document.getElementById('gg').checked))
  	{
  		//alert('pulling of data from issues collection');
  		var issue =  Issues.findOne(this._id);
		var person =  issue.subscribedUsers;
		var flag=0;

		if(person && person.length)
		{
				var j;
				//alert('5');
				for(j= 0;j< person.length;j++)
				{
					if(person[j].username === Meteor.user().username)
					{	
					
						var personId=person[j]._id;
						// Removing the username from the collection if s/he has unsubscribed to that issue
						//alert('user wants to unsubscribe from this issue');
						Issues.update(this._id,{$pull:{subscribedUsers:{_id:personId}}});
						var raisedUnSubscribedUserMsg = "Hello "+issueRaisedUser +",\n\n"+
	    					userName + ' has unsubscribed to your issue having issueId:- ';
    					var managerUnSubscribedMsg = "Hello "+ managerName +",\n\n"+
    						userName + ' has unsubscribed to the issue belonging to your category having issueId:- ';
						var subOfUnSubscribedIssue = 'Notification of UnSubscribed Issue';

						// Send mail to the user who has posted the issue regarding unsubscription by the user
						if(issueRaisedUser!='')
					  	{	 
	
							Meteor.call('sendEmail',
        	    				issueRaisedUserEmailId,
			        			senderEmail,
			        			raisedUnSubscribedUserMsg,
				    			this._id,
				    			subOfUnSubscribedIssue);

							Notifications.insert({
								userId: personId, // users id who has posted the issue
								issueId: this._id,   // issue id
								//commentId: comment._id,
								//commenterName: comment.author,
								unSubscribedUserId:Meteor.user() ,
								unSubscribedUserName: Meteor.user().username,
								read: false
							});	

						}

	
						// Send mail to the manager regarding unsubscription by the user
						Meteor.call('sendEmail',
        	    			managerEmailId,
			        		senderEmail,
			        		managerUnSubscribedMsg,
				    		this._id,
				    		subOfUnSubscribedIssue); 
						flag =1;
		        	    break; 
					}
				}
   		
   		} 
		if(flag ===0)   			
		{
			var listOfDomain = Subscribed.find();
			listOfDomain.forEach( function(myDoc) 
			{
				if(myDoc.category === issue.category)
				{
					var person = myDoc.categorySubscribedUsers;
					if(person && person.length)
					{
						for(j=0;j<person.length;j++)
						{
							if(Meteor.user().username === person[j].username)
							{
								//alert('domain has been subscribed but issue needs to be unsubscribed ');
								//alert('myDoc._id '+myDoc._id);
								//alert('cursor '+cursor);
								//Subscribed.update({_id:myDoc._id, categorySubscribedUsers:person[j].username}, {$addToSet: {categorySubscribedUsers.$.issuesNotToDisplay: cursor}});
								
								//break;
							}
						}
					}
				}
			});
		}
	} 
}

});
   
// For getting user specific subscribed issues

Template.fullIssue.done_checkbox = function () {
	alert('inside done_checkbox');

	var mgr = Subscribed.find();
	//alert('mgr '+mgr);

	var issues =  Issues.findOne(this._id);
	//alert('issues '+issues);

	var details = issues.details;
	//alert('det '+det);

	var shortdesc = issues.shortdesc;
	//alert('shortdesc '+shortdesc);
	
	var detres='', shortdescres='';

	//Determining whether details and shortdesc field are empty or not
	if(details)
	{
		detres = details.split(" ");
	}
	if(shortdesc)
	{
		shortdescres = shortdesc.split(" ");
	}
	//alert('after getting details and shortdesc values');
	var ch='';
	var flag=0;
	//alert('Meteor.user().username '+Meteor.user().username);
	//alert('before forEach');

	// Checking each document of subscribed collection whether user has subscibed to that keyword already
	mgr.forEach( function(myDoc) {
	//alert('inside forEach');
	//alert('myDoc.category '+myDoc.category);

	// Picking each word from the details and shortdesc field
	// 	for (var i=0; i < shortdescres.length; i++)
	//	{
	//		alert('shortdescres value '+shortdescres[i]);
	//	}
	//	for (var i=0; i < detres.length; i++)
	//	{
	//		alert('detres value '+detres[i]);
	//	}
	//	var unmarked=0;
		// Checking the presence of keyword in details field
	 	for (var i=0; i < detres.length; i++)
		{
			if(detres[i] ===myDoc.category)
			{
	//			alert('inside if comparison of detres');
		
				var person = myDoc.categorySubscribedUsers;
				
				if(person && person.length)
				{
					for(j=0;j<person.length;j++)
					{
						if(Meteor.user().username === person[j].username)
						{
							//var issuesToBeUnmarked = myDoc.categorySubscribedUsers.issuesNotToDisplay;
							//alert('issuesToBeUnmarked.length '+issuesToBeUnmarked.length);
							//for(var k=0;k<issuesToBeUnmarked.length;k++)
							//{
							//	if(issuesToBeUnmarked[k]._id === Issues.findOne(this._id))
							//	{
							//		unmarked=1;
							//		break;
							//	}

							//} 
		//					if(unmarked ===0)
		//					{
								ch="checked";
								flag =1;
		//						alert('value of ch that is set for subscribed collection inside detres block'+ch);
								break;
		//					}
						}
					}
				}
			}
			if(flag ===1)
				break;
		} 

		// Checking the presence of keyword in shortdesc field
		if(flag===0)
		{
	//		alert('inside shortdesc');
			for (var i=0; i < shortdescres.length; i++)
			{
				if(shortdescres[i] ===myDoc.category)
				{
	//				alert('inside if comparison of shortdesc');
		
					var person = myDoc.categorySubscribedUsers;
			
					if(person && person.length)
					{
						for(j=0;j<person.length;j++)
						{
							if(Meteor.user().username === person[j].username)
							{
								//var issuesToBeUnmarked = myDoc.categorySubscribedUsers.issuesNotToDisplay;
								//alert('issuesToBeUnmarked.length '+issuesToBeUnmarked.length);
								//for(var k=0;k<issuesToBeUnmarked.length;k++)
								//{
								//	if(issuesToBeUnmarked[k]._id === Issues.findOne(this._id))
								//	{
								//		unmarked=1;
								//		break;
								//	}

								//}
		//						if(unmarked ===0)
		//						{
									ch="checked";
									flag =1;
			//						alert('value of ch that is set for subscribed collection inside detres block'+ch);
									break;
		//						}
							}
						}
					}
				}
				if(flag ===1)
					break;
			}
		}

	//	alert('before rest of the form');
	//	alert('a.category '+a.category);
	//	alert('myDoc.category '+myDoc.category);
	//	alert('a.unit '+a.unit);
	//	alert('a.dept '+a.dept);

		// Checking the presence of keyword in rest of the form fields
		
	 	if((issues.category === myDoc.category || issues.unit === myDoc.category || issues.dept === myDoc.category) && flag ===0)
		{
	//		alert('inside rest of the form');
			var i;
			var person = myDoc.categorySubscribedUsers;
			
			for(i=0;i<person.length;i++)
			{
				if(Meteor.user().username === person[i].username)
				{
					//var issuesToBeUnmarked = myDoc.categorySubscribedUsers.issuesNotToDisplay;
					//alert('issuesToBeUnmarked.length '+issuesToBeUnmarked.length);
					//for(var k=0;k<issuesToBeUnmarked.length;k++)
					//{
					//	if(issuesToBeUnmarked[k]._id === Issues.findOne(this._id))
					//	{
					//		unmarked=1;
					//		break;
					//	}

					//}
		//			if(unmarked ===0)
		//			{
						ch="checked";
						flag =1;
			//			alert('value of ch that is set for subscribed collection inside detres block'+ch);
						break;
		//			}
				}


			}
		}
		
		
	});  

	// Checking whether user has subscribed to that issue only and not to whole domain/keyword.
	// Returning 'checked'/ '' depending upon user has already subscribed to the issue.
	
	if(!ch)
	{
//		alert('issues part');	
		var issue =  Issues.findOne(this._id);
		var person =  issue.subscribedUsers;
		if(person && person.length )
		{
			var j;

			for(j= 0;j< person.length;j++)
			{
//				alert('j '+j);
//				alert('person '+person[j].username);
				if(person[j].username === Meteor.user().username)
				{	
					ch ="checked";
//					alert('value of ch that is set of issues part'+ch);
					break; 
				}
			}
			if(ch=== 'checked')
			{
//				alert('while returning value in if block of issues part');
				return 'checked="checked"';
			}
			else		
			{
//				alert('while returning value in else block of issues part');
				return '';
			}
		}	
		else
		{
//				alert('while returning value in else block of issues part');
				return '';
		}
	}
	else
		return 'checked="checked"';
	
};
