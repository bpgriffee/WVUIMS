var pageSession = new ReactiveDict();

Template.ItemsDetailsItems.rendered = function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
};

Template.ItemsDetailsItems.events({
	
});

Template.ItemsDetailsItems.helpers({
	
});

var ItemsDetailsItemsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ItemsDetailsItemsViewSearchString");
	var sortBy = pageSession.get("ItemsDetailsItemsViewSortBy");
	var sortAscending = pageSession.get("ItemsDetailsItemsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["fieldName", "value"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};

var ItemsDetailsItemsViewExport = function(cursor, fileType) {
	var data = ItemsDetailsItemsViewItems(cursor);
	var exportFields = ["fieldName", "value"];

	var str = exportArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.ItemsDetailsItemsView.rendered = function() {
	pageSession.set("ItemsDetailsItemsViewStyle", "table");
	
};

Template.ItemsDetailsItemsView.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("ItemsDetailsItemsViewSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("ItemsDetailsItemsViewSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("ItemsDetailsItemsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("items.details.insert", mergeObjects(Router.currentRouteParams(), {itemId: this.params.itemId}));
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		ItemsDetailsItemsViewExport(this.item_details, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		ItemsDetailsItemsViewExport(this.item_details, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		ItemsDetailsItemsViewExport(this.item_details, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		ItemsDetailsItemsViewExport(this.item_details, "json");
	}

	
});

Template.ItemsDetailsItemsView.helpers({

	"insertButtonClass": function() {
		return ItemDetails.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.item_details || this.item_details.count() == 0;
	},
	"isNotEmpty": function() {
		return this.item_details && this.item_details.count() > 0;
	},
	"isNotFound": function() {
		return this.item_details && pageSession.get("ItemsDetailsItemsViewSearchString") && ItemsDetailsItemsViewItems(this.item_details).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ItemsDetailsItemsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ItemsDetailsItemsViewStyle") == "table";
	},
	"viewAsBlog": function() {
		return pageSession.get("ItemsDetailsItemsViewStyle") == "blog";
	},
	"viewAsList": function() {
		return pageSession.get("ItemsDetailsItemsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ItemsDetailsItemsViewStyle") == "gallery";
	}

	
});


Template.ItemsDetailsItemsViewTable.rendered = function() {
	
};

Template.ItemsDetailsItemsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("ItemsDetailsItemsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("ItemsDetailsItemsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("ItemsDetailsItemsViewSortAscending") || false;
			pageSession.set("ItemsDetailsItemsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("ItemsDetailsItemsViewSortAscending", true);
		}
	}
});

Template.ItemsDetailsItemsViewTable.helpers({
	"tableItems": function() {
		return ItemsDetailsItemsViewItems(this.item_details);
	}
});


Template.ItemsDetailsItemsViewTableItems.rendered = function() {
	
};

Template.ItemsDetailsItemsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		/**/
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Meteor.call("itemDetailsUpdate", this._id, values, function(err, res) {
			if(err) {
				alert(err.message);
			}
		});

		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						ItemDetails.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click #edit-button": function(e, t) {
		e.preventDefault();
		Router.go("item.details.edit", mergeObjects(Router.currentRouteParams(), {invoiceId: UI._parentData(1).params.itemId, item_detailsId: this._id}));
		return false;
	}
});

Template.ItemsDetailsItemsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return ItemDetails.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return ItemDetails.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
