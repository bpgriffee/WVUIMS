this.Items = new Mongo.Collection("items");

this.Items.userCanInsert = function(userId, doc) {
	return true;
};

this.Items.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.Items.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
