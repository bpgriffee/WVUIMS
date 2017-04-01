Meteor.methods({
	"photosInsert": function(data) {
		return Photos.insert(data);
	},
	"photosUpdate": function(id, data) {
		Photos.update({ _id: id }, { $set: data });
	},
	"photosRemove": function(id) {
		Photos.remove({ _id: id });
	}
});
