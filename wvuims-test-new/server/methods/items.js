Meteor.methods({
	"itemsInsert": function(data) {
		return Items.insert(data);
	},
	"itemsUpdate": function(id, data) {
		Items.update({ _id: id }, { $set: data });
	},
	"itemsRemove": function(id) {
		Items.remove({ _id: id });
	}
});
