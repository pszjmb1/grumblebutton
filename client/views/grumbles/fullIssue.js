/**
*Template to show issue details on the page
*
*/

Template.fullIssue.helpers({
	test: function() {
		alert('here');
	}
});

Template.fullIssue.events({


'click #gg': function () {
	alert('inside fullIssue.js - > events -> function');
	alert('inside fullIssue');

	//alert('1');
	var fromEmail = 'grumblebutton@gmail.com';
    var userId = Meteor.user();
    var userName = userId.username;
    var issueRaisedUser = Issues.findOne(this._id).author;
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

		// Send mail to the user who has posted the issue
		if(issueRaisedUser!='')
		{ 
		
			Meteor.call('sendEmail',
        	    	'arora.priya4172@gmail.com',
			        fromEmail,
			        raisedSubscribedUserMsg,
				    this._id,
				    subOfSubscribedIssue);
		}
	
		// Send mail to the manager
		Meteor.call('sendEmail',
        	    	managerEmailId,
			        fromEmail,
			        managerSubscribedMsg,
				    this._id,
				    subOfSubscribedIssue); 
	}
   	else if (!(document.getElementById('gg').checked))
  	{
  		//alert('pulling of data from issues collection');
  		var cursor =  Issues.findOne(this._id);
		var person =  cursor.subscribedUsers;
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
        	    				'arora.priya4172@gmail.com',
			        			fromEmail,
			        			raisedUnSubscribedUserMsg,
				    			this._id,
				    			subOfUnSubscribedIssue);
					}
	
					// Send mail to the manager regarding unsubscription by the user
					Meteor.call('sendEmail',
        	    			managerEmailId,
			        		fromEmail,
			        		managerUnSubscribedMsg,
				    		this._id,
				    		subOfUnSubscribedIssue); 

		            break; 
				}
			}
   		
   		}
   	}
}

});
   
// For getting user specific subscribed issues

Template.fullIssue.done_checkbox = function () {
	//alert('inside done_checkbox');
	
	var mgr = Subscribed.find();
	//alert('mgr '+mgr);

	var cursor =  Issues.findOne(this._id);
	//alert('cursor '+cursor);

	var det = cursor.details;
	//alert('det '+det);

	var shortdesc = cursor.shortdesc;
	//alert('shortdesc '+shortdesc);
	
	var detres='', shortdescres='';

	//Determining whether details and shortdesc field are empty or not
	if(det)
	{
		detres = det.split(" ");
	}
	if(shortdesc)
	{
		shortdescres = shortdesc.split(" ");
	}
	//alert('after getting details and shortdesc values');
	var ch='';
	var flag=0;
	//alert('before forEach');

	// Checking each document of subscribed collection whether user has subscibed to that keyword already
	mgr.forEach( function(myDoc) {
	//	alert('inside forEach');
	//	alert('myDoc.category '+myDoc.category);

	// Picking each word from the details and shortdesc field
	// 	for (var i=0; i < shortdescres.length; i++)
	//	{
	//		alert('shortdescres value '+shortdescres[i]);
	//	}
	//	for (var i=0; i < detres.length; i++)
	//	{
	//		alert('detres value '+detres[i]);
	//	}
	
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
							ch="checked";
							flag =1;
	//						alert('value of ch that is set for subscribed collection inside detres block'+ch);
							break;
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
								ch="checked";
								flag =1;
	//							alert('value of ch that is set for subscribed collection inside shortdesc block'+ch);
								break;
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
		
	 	if((cursor.category === myDoc.category || cursor.unit === myDoc.category || cursor.dept === myDoc.category) && flag ===0)
		{
	//		alert('inside rest of the form');
			var i;
			var person = myDoc.categorySubscribedUsers;
			
			for(i=0;i<person.length;i++)
			{
				if(Meteor.user().username === person[i].username)
				{
					ch="checked";
					flag =1;
	//				alert('value of ch that is set for subscribed collection in rest of the issues category'+ch);
					break;
				}


			}
		}
		
		
	});  

	// Checking whether user has subscribed to that issue only and not to whole domain/keyword.
	// Returning 'checked'/ '' depending upon user has already subscribed to the issue.
	
	if(!ch)
	{
//		alert('issues part');	
		var cursor =  Issues.findOne(this._id);
		var person =  cursor.subscribedUsers;
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
