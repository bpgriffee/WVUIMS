this.ItemDetails = new Mongo.Collection("item_details");

this.ItemDetails.userCanInsert = function(userId, doc) {
	return true;
};

this.ItemDetails.userCanUpdate = function(userId, doc) {
	return userId && doc.ownerId == userId;
};

this.ItemDetails.userCanRemove = function(userId, doc) {
	return userId && doc.ownerId == userId;
};
