this.ItemsDetailsItemsController = RouteController.extend({
	template: "ItemsDetails",
	

	yieldTemplates: {
		'ItemsDetailsItems': { to: 'ItemsDetailsSubcontent'}
		
	},

	onBeforeAction: function() {
		this.next();
	},

	action: function() {
		if(this.isReady()) { this.render(); } else { this.render("ItemsDetails"); this.render("loading", { to: "ItemsDetailsSubcontent" });}
		/*ACTION_FUNCTION*/
	},

	isReady: function() {
		

		var subs = [
			Meteor.subscribe("item_details", this.params.itemId),
			Meteor.subscribe("item_info", this.params.itemId)
		];
		var ready = true;
		_.each(subs, function(sub) {
			if(!sub.ready())
				ready = false;
		});
		return ready;
	},

	data: function() {
		

		var data = {
			params: this.params || {},
			item_details: ItemDetails.find({itemId:this.params.itemId}, {}),
			item_info: Items.findOne({_id:this.params.itemId}, {})
		};
		

		

		return data;
	},

	onAfterAction: function() {
		
	}
});