/**
* Email functionality for notification
*/

if (Meteor.isServer) {
Meteor.methods({
  sendEmail: function (sendee, fromEmail, msg, id, subject) {
    var addressee = Meteor.users.findOne({_id: sendee});
    var toEmail = addressee.emails[0].address;
    // Let other method calls from the same client start running,
    // without waiting for the email sending to complete.
    this.unblock();
  
    Email.send({
        to: toEmail,
        from: fromEmail,
        subject: subject,
        text: msg+id+"\n\n\n\n."
      });
  
  }
});

}

