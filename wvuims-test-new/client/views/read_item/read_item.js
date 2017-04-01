Template.ReadItem.rendered = function() {

	Meteor.defer(function() {
		globalOnRendered();
		$("input[autofocus]").focus();
	});
};

Template.ReadItem.events({

});

Template.ReadItem.helpers({

});

Template.ReadItemReaderJumbotron.rendered = function() {

};

Template.ReadItemReaderJumbotron.events({
  "click #jumbotron-button": function(e, t) {
		e.preventDefault();
    var itemId = "";
    var message = [
      ndef.textRecord("hello, world"),
      ndef.uriRecord("http://github.com/chariotsolutions/phonegap-nfc")
    ];

    nfc.addNdefListener (
        function listenerCallback(nfcEvent) {
            var tag = nfcEvent.tag,
                ndefMessage = tag.ndefMessage;

            itemId=(nfc.bytesToString(ndefMessage[0].payload).substring(3));
            nfc.removeNdefListener(listenerCallback)
            Router.go("items.details.items", {itemId});
        },
        function () { // success callback
            alert("Waiting for NDEF tag");
        },
        function (error) { // error callback
            alert("Error adding NDEF listener " + JSON.stringify(error));
        }
    );
	}
});

Template.ReadItemReaderJumbotron.helpers({

});
