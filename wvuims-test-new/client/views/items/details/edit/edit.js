var pageSession = new ReactiveDict();

Template.ItemsDetailsEdit.rendered = function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
};

Template.ItemsDetailsEdit.events({
	
});

Template.ItemsDetailsEdit.helpers({
	
});

Template.ItemsDetailsEditEditForm.rendered = function() {
	

	pageSession.set("itemsDetailsEditEditFormInfoMessage", "");
	pageSession.set("itemsDetailsEditEditFormErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.ItemsDetailsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("itemsDetailsEditEditFormInfoMessage", "");
		pageSession.set("itemsDetailsEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(result, msg) {
			var itemsDetailsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(itemsDetailsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("itemsDetailsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("items.details", mergeObjects(Router.currentRouteParams(), {itemId: self.params.itemId}));
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("itemsDetailsEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Meteor.call("itemDetailsUpdate", t.data.item_details._id, values, function(e, r) { if(e) errorAction(e); else submitAction(r); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("items.details", mergeObjects(Router.currentRouteParams(), {itemId: this.params.itemId}));
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.ItemsDetailsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("itemsDetailsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("itemsDetailsEditEditFormErrorMessage");
	}
	
});
