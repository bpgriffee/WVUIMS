var pageSession = new ReactiveDict();

Template.ItemsInsert.rendered = function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
};

Template.ItemsInsert.events({
	
});

Template.ItemsInsert.helpers({
	
});

Template.ItemsInsertInsertForm.rendered = function() {
	

	pageSession.set("itemsInsertInsertFormInfoMessage", "");
	pageSession.set("itemsInsertInsertFormErrorMessage", "");

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

Template.ItemsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("itemsInsertInsertFormInfoMessage", "");
		pageSession.set("itemsInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(result, msg) {
			var itemsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(itemsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("itemsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("items.details", mergeObjects(Router.currentRouteParams(), {itemId: result}));
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("itemsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Meteor.call("itemsInsert", values, function(e, r) { if(e) errorAction(e); else submitAction(r); });
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
	}, 

	"change #field-file-id": function(e, t) {
	e.preventDefault();
	var fileInput = $(e.currentTarget);
	var dataField = fileInput.attr("data-field");
	var hiddenInput = fileInput.closest("form").find("input[name='" + dataField + "']");

	FS.Utility.eachFile(e, function(file) {
		Photos.insert(file, function (err, fileObj) {
			if(err) {
				console.log(err);
			} else {
				hiddenInput.val(fileObj._id);
			}
		});
	});
}

});

Template.ItemsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("itemsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("itemsInsertInsertFormErrorMessage");
	}
	
});
