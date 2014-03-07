Template.grumble.events({
	'submit form': function(e) {
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
		 
		 var msg = document.querySelector('[name=shortdesc]').value;
		 var category = document.querySelector('[name=category]').value; 
         var fromEmail = 'grumblebutton@gmail.com';
		 
		 var managerName = Managers.findOne({category:category});
		
	       // alert(managerName.Name);
	     var toEmail = Managers.findOne({category:category});
	     var message = "Hello "+managerName.name+",\n\n"+msg+
    ". Can you please look after the matter asap.\n\n"+
       "The link for the concerned issue is :- http://localhost:3000/issues/";
		//To call sendmessage() for sending email
		var subject = "Notification of New Issue";
		
		Meteor.call('grumble', issue, function(error, id) {
			if (error)
				throwError(error.reason);
			else {
				Meteor.call('sendEmail',
        	    		   	   toEmail.emailId,
			                   fromEmail,
			                   message,
				           	   id,
				           	   subject);
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
