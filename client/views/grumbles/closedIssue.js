/**
 * Template helpers for a closed issue
 */

Template.closedIssue.events({
	/*
 'click .destroy': function () {
    ClosedIssues.remove(this._id);
	}, */

 'click #gg': function () {
 	/*
 	var id = ClosedIssues.findOne(this._id);
 	//alert('id collected '+id);
 	Issues.insert(id);
 	//alert('added to Issues');
    ClosedIssues.remove(this._id);
    //alert('removed from closedIssues');
    */
    alert('inside closedIssue -> resetting issueClosed field value');
   	Issues.update(this._id, {$set: {issueClosed: 0}});

    }
});




   

