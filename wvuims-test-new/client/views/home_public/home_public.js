Template.HomePublic.rendered = function() {
	
	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
};

Template.HomePublic.events({
	
});

Template.HomePublic.helpers({
	
});

Template.HomePublicHomeJumbotron.rendered = function() {
	
};

Template.HomePublicHomeJumbotron.events({
	"click #jumbotron-button": function(e, t) {
		e.preventDefault();
		Router.go("login", {});
	}
	
});

Template.HomePublicHomeJumbotron.helpers({
	
});
