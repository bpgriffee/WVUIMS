Meteor.methods({
	"itemDetailsInsert": function(data) {
		return ItemDetails.insert(data);
	},
	"itemDetailsUpdate": function(id, data) {
		ItemDetails.update({ _id: id }, { $set: data });
	},
	"itemDetailsRemove": function(id) {
		ItemDetails.remove({ _id: id });
	}
});
