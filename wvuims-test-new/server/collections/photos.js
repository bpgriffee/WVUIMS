Photos.allow({
	insert: function (userId, doc) {
		return Photos.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Photos.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Photos.userCanRemove(userId, doc);
	},

	download: function (userId, doc) {
		return Photos.userCanDownload(userId, doc);
	}
});
