/**
 * Template helpers for an issue
 */

Template.closedIssue.events({
	/*
 'click .destroy': function () {
    ClosedIssues.remove(this._id);
	}, */

 'click #gg': function () {
 	var id = ClosedIssues.findOne(this._id);
 	//alert('id collected '+id);
 	Issues.insert(id);
 	//alert('added to Issues');
    ClosedIssues.remove(this._id);
    //alert('removed from closedIssues');
    }
});




   

