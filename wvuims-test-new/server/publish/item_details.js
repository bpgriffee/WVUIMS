Meteor.publish("item_details", function(itemId) {
	return ItemDetails.find({itemId:itemId,ownerId:this.userId}, {});
});

Meteor.publish("item_details_empty", function() {
	return ItemDetails.find({_id:null,ownerId:this.userId}, {});
});

Meteor.publish("item_detail", function(item_detailsId) {
	return ItemDetails.find({_id:item_detailsId,ownerId:this.userId}, {});
});

Meteor.publish("item_details_find_one", function(itemId) {
	return ItemDetails.find({itemId:itemId,ownerId:this.userId}, {});
});

