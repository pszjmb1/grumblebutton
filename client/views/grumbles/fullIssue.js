
Template.fullIssue.events({
'click #gg': function () {

	//alert('1');
	var fromEmail = 'grumblebutton@gmail.com';
    var userId = Meteor.user();
    var userName = userId.username;
    var issueRaisedUser = Issues.findOne(this._id).author;
	var issueManagerCategory = Issues.findOne(this._id).category;
	var managerEmailId = Managers.findOne({category: issueManagerCategory}).emailId;
	var managerName = Managers.findOne({category: issueManagerCategory}).name;
	
	if(document.getElementById('gg').checked)
	{
		//alert('inserting of data in issues collection');
  		Issues.update(this._id, {$addToSet: {subscribedUsers : Meteor.user()}});
		var raisedSubscribedUserMsg = "Hello "+issueRaisedUser +",\n\n"+
    		userName + ' has subscribed to your issue having issueId:- ';
    	
    	var managerSubscribedMsg = "Hello "+ managerName +",\n\n"+
    		userName + ' has subscribed to the issue belonging to your category having issueId:- ';
    	
		var subOfSubscribedIssue = 'Notification of Subscribed Issue';
		if(issueRaisedUser!='')
		{ 
		
			Meteor.call('sendEmail',
        	    	'arora.priya4172@gmail.com',
			        fromEmail,
			        raisedSubscribedUserMsg,
				    this._id,
				    subOfSubscribedIssue);
		}
	
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
  		var a =  Issues.findOne(this._id);
		var person =  a.subscribedUsers;
		if(person && person.length)
		{
			var j;
			//alert('5');
			for(j= 0;j< person.length;j++)
			{
				if(person[j].username === Meteor.user().username)
				{	
					
					var personId=person[j]._id;
					Issues.update(this._id,{$pull:{subscribedUsers:{_id:personId}}});
					var raisedUnSubscribedUserMsg = "Hello "+issueRaisedUser +",\n\n"+
    					userName + ' has unsubscribed to your issue having issueId:- ';
    				var managerUnSubscribedMsg = "Hello "+ managerName +",\n\n"+
    					userName + ' has unsubscribed to the issue belonging to your category having issueId:- ';
					var subOfUnSubscribedIssue = 'Notification of UnSubscribed Issue';
					if(issueRaisedUser!='')
					  { 
	
							Meteor.call('sendEmail',
        	    				'arora.priya4172@gmail.com',
			        			fromEmail,
			        			raisedUnSubscribedUserMsg,
				    			this._id,
				    			subOfUnSubscribedIssue);
					}
	
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
	var mgr = Managers.find();
	var a =  Issues.findOne(this._id);
	var det = a.details;
	var shortdesc = a.shortdesc;
	var detres='', shortdescres='';
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

	mgr.forEach( function(myDoc) {
	//	alert('inside forEach');
	//	alert('myDoc.category '+myDoc.category);
	/* 	for (var i=0; i < shortdescres.length; i++)
		{
			alert('shortdescres value '+shortdescres[i]);
		}
	 	for (var i=0; i < detres.length; i++)
		{
			alert('detres value '+detres[i]);
		}
	*/
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
	//						alert('value of ch that is set for managers collection inside detres block'+ch);
							break;
						}
					}
				}
			}
			if(flag ===1)
				break;
		} 
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
	//							alert('value of ch that is set for managers collection inside shortdesc block'+ch);
								break;
							}
						}
					}
				}
				if(flag ===1)
					break;
			}
		}
	/*	alert('before rest of the form');
		alert('a.category '+a.category);
		alert('myDoc.category '+myDoc.category);
		alert('a.unit '+a.unit);
		alert('a.dept '+a.dept);*/
	 	if((a.category === myDoc.category || a.unit === myDoc.category || a.dept === myDoc.category) && flag ===0)
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
	//				alert('value of ch that is set for managers collection in rest of the issues category'+ch);
					break;
				}


			}
		}
		
	});  
	if(!ch)
	{
//		alert('issues part');	
		var a =  Issues.findOne(this._id);
		var person =  a.subscribedUsers;
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
