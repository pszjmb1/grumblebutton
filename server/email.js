if (Meteor.isServer) {
Meteor.methods({
  sendEmail: function (toEmail, fromEmail, msg, id, subject) {
    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();
 
   Email.send({
      to: toEmail,
      from: fromEmail,
      subject: subject,
      text: msg+id+"\n\n\n\n."
    });
	//console.log("email sent!");
  }
});

}

