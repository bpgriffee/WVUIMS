var pageSession = new ReactiveDict();

Template.ItemsDetailsInsert.rendered = function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
};

Template.ItemsDetailsInsert.events({
	
});

Template.ItemsDetailsInsert.helpers({
	
});

Template.ItemsDetailsInsertInsertForm.rendered = function() {
	

	pageSession.set("itemsDetailsInsertInsertFormInfoMessage", "");
	pageSession.set("itemsDetailsInsertInsertFormErrorMessage", "");

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

Template.ItemsDetailsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("itemsDetailsInsertInsertFormInfoMessage", "");
		pageSession.set("itemsDetailsInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(result, msg) {
			var itemsDetailsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(itemsDetailsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("itemsDetailsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("items.details", mergeObjects(Router.currentRouteParams(), {itemId: self.params.itemId}));
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("itemsDetailsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				values.itemId = self.params.itemId;

				Meteor.call("itemDetailsInsert", values, function(e, r) { if(e) errorAction(e); else submitAction(r); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("items.details", mergeObjects(Router.currentRouteParams(), {itemsId: this.params.itemId}));
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

Template.ItemsDetailsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("itemsDetailsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("itemsDetailsInsertInsertFormErrorMessage");
	}
	
});
