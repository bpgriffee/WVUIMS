this.Photos = new FS.Collection("photos", {
	stores: [new FS.Store.GridFS("photos", {})]
});

this.Photos.userCanInsert = function(userId, doc) {
	return true;
};

this.Photos.userCanUpdate = function(userId, doc) {
	return true;
};

this.Photos.userCanRemove = function(userId, doc) {
	return true;
};

this.Photos.userCanDownload = function(userId, doc) {
	return true;
};
