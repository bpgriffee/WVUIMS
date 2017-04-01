var pageSession = new ReactiveDict();

Template.ItemsEdit.rendered = function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
};

Template.ItemsEdit.events({
	
});

Template.ItemsEdit.helpers({
	
});

Template.ItemsEditEditForm.rendered = function() {
	

	pageSession.set("itemsEditEditFormInfoMessage", "");
	pageSession.set("itemsEditEditFormErrorMessage", "");

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

Template.ItemsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("itemsEditEditFormInfoMessage", "");
		pageSession.set("itemsEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(result, msg) {
			var itemsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(itemsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("itemsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("items", mergeObjects(Router.currentRouteParams(), {}));
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("itemsEditEditFormErrorMessage", message);
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

		

		Router.go("items", mergeObjects(Router.currentRouteParams(), {}));
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

Template.ItemsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("itemsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("itemsEditEditFormErrorMessage");
	}
	
});
