Template.HomePrivate.rendered = function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
};

Template.HomePrivate.events({
	
});

Template.HomePrivate.helpers({
	
});

Template.HomePrivateHomePrivateJumbotron.rendered = function() {
	
};

Template.HomePrivateHomePrivateJumbotron.events({
	"click #jumbotron-button": function(e, t) {
		e.preventDefault();
		Router.go("items", {});
	}
	
});

Template.HomePrivateHomePrivateJumbotron.helpers({
	
});
