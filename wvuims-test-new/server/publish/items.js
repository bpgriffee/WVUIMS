Meteor.publish("item_list", function() {
	return Items.publishJoinedCursors(Items.find({ownerId:this.userId}, {}));
});

Meteor.publish("items_empty", function() {
	return Items.publishJoinedCursors(Items.find({_id:null,ownerId:this.userId}, {}));
});

Meteor.publish("item_info", function(itemId) {
	return Items.publishJoinedCursors(Items.find({_id:itemId,ownerId:this.userId}, {}));
});

