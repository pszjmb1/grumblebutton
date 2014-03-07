/**
 * Template helpers for an issue
 */

/*Template.closedIssue.reopen = function () {
  	alert('before removing from closedIssues collection');
 	var id = ClosedIssues.findOne(this._id);
    ClosedIssues.remove(id);
    Issues.insert(id);
  					
}*/

Template.closedIssue.events({
 'click .destroy': function () {
    ClosedIssues.remove(this._id);
	}

 'click #submit': function () {
 	//alert('before removing from closedIssues collection');
 	var id = ClosedIssues.findOne(this._id);
    ClosedIssues.remove(id);
    Issues.insert(id);
	}
});
   

