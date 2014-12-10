Template.layout.events({
	'blur fieldset.formField > input, blur fieldset.formField > textarea' : function(e){
		var label = $(e.currentTarget).parent().children('label');
		if(label && label[0]){
			if(e.currentTarget.value !== ""){
				$(e.currentTarget).addClass("filled");
				label.addClass("filled");
			}
			else{
				$(e.currentTarget).removeClass("filled");
				label.removeClass("filled");
			}
			label.html(label[0].dataset["blur"]);
		}
	},

	'focus fieldset.formField > input, focus fieldset.formField > textarea' : function(e){
		var label = $(e.currentTarget).parent().children('label');
		if(label && label[0]){
			label.html(label[0].dataset["focus"]);
		}
	},

	'change fieldset.formField > input, change fieldset.formField > textarea' : function(e){
		var label = $(e.currentTarget).parent().children('label');

		if(label && label[0] && e.currentTarget.value !== ""){
			label.addClass("filled");
			label.html(label[0].dataset["focus"]);
		}
	},

	'click input[type=reset]' : function(e){
		console.log($(e.target).parent().children());
		var form = $(e.currentTarget).parent().children();
		var fieldsets = (form.eq(1).children()).add(form.eq(2).children());
		console.log(fieldsets);
		fieldsets.children().removeClass('filled');
		var labels = fieldsets.children("label");
		console.log(labels);
		labels.each(function () {
			console.log(this);
			this.innerHTML = this.dataset["blur"];
		});
	}
});