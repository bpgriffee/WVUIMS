var pageSession = new ReactiveDict();

Template.Items.rendered = function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
};

Template.Items.events({
	
});

Template.Items.helpers({
	
});

var ItemsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ItemsViewSearchString");
	var sortBy = pageSession.get("ItemsViewSortBy");
	var sortAscending = pageSession.get("ItemsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["itemName", "serialNo", "description", "fileId"];
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

var ItemsViewExport = function(cursor, fileType) {
	var data = ItemsViewItems(cursor);
	var exportFields = ["itemName", "serialNo", "description"];

	var str = exportArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.ItemsView.rendered = function() {
	pageSession.set("ItemsViewStyle", "table");
	
};

Template.ItemsView.events({
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
				pageSession.set("ItemsViewSearchString", searchString);
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
					pageSession.set("ItemsViewSearchString", searchString);
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
					pageSession.set("ItemsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("items.insert", mergeObjects(Router.currentRouteParams(), {}));
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		ItemsViewExport(this.item_list, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		ItemsViewExport(this.item_list, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		ItemsViewExport(this.item_list, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		ItemsViewExport(this.item_list, "json");
	}

	
});

Template.ItemsView.helpers({

	"insertButtonClass": function() {
		return Items.userCanInsert(Meteor.userId(), {}) ? "" : "hidden";
	},

	"isEmpty": function() {
		return !this.item_list || this.item_list.count() == 0;
	},
	"isNotEmpty": function() {
		return this.item_list && this.item_list.count() > 0;
	},
	"isNotFound": function() {
		return this.item_list && pageSession.get("ItemsViewSearchString") && ItemsViewItems(this.item_list).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ItemsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ItemsViewStyle") == "table";
	},
	"viewAsBlog": function() {
		return pageSession.get("ItemsViewStyle") == "blog";
	},
	"viewAsList": function() {
		return pageSession.get("ItemsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ItemsViewStyle") == "gallery";
	}

	
});


Template.ItemsViewTable.rendered = function() {
	
};

Template.ItemsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("ItemsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("ItemsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("ItemsViewSortAscending") || false;
			pageSession.set("ItemsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("ItemsViewSortAscending", true);
		}
	}
});

Template.ItemsViewTable.helpers({
	"tableItems": function() {
		return ItemsViewItems(this.item_list);
	}
});


Template.ItemsViewTableItems.rendered = function() {
	
};

Template.ItemsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		
		Router.go("items.details", mergeObjects(Router.currentRouteParams(), {itemId: this._id}));
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Meteor.call("itemsUpdate", this._id, values, function(err, res) {
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
						Items.remove({ _id: me._id });
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
		Router.go("items.edit", mergeObjects(Router.currentRouteParams(), {itemId: this._id}));
		return false;
	}
});

Template.ItemsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }, 
	"editButtonClass": function() {
		return Items.userCanUpdate(Meteor.userId(), this) ? "" : "hidden";
	},

	"deleteButtonClass": function() {
		return Items.userCanRemove(Meteor.userId(), this) ? "" : "hidden";
	}
});
