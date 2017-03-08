var express = require('express');
var router = express.Router();
var mongojs = require('mongojs');
var db = mongojs('mongodb://bp:bp@ds157258.mlab.com:57258/wvuims', ['test']);


//get all tasks
router.get('/findall', function(req, res, next){
	db.test.find( function(err, docs) {
		if (err) {
			res.send(err);
		}
		res.json(docs);
	});
});


//get single task
router.get('/find/:id', function(req, res, next) {
	db.test.findOne({ _id: mongojs.ObjectId(req.params.id)}, function(err,docs) {
		if (err) {
			res.send(err);
		}
		res.json(docs);
	});
});

router.post('/search', function(req, res, next) {
	var query = req.body;
	console.log('\nsearch req body inc:\n');
	console.log(query);
	db.test.find(query, function(err, items) {
		if (err) {
			res.send(err);
		}
		res.json(items);
	});

});
//save object
router.post('/item', function(req, res, next) {
	var item = req.body;
	//validate item here
	db.test.save(item, function(err, item) {
		if (err) {
			res.send(err);
		}
		res.json(item);
	});
});

//router.search('/find', function(req, res, next) {
//}
module.exports = router;

