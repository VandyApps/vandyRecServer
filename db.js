var mongodb = require('mongodb'),
	Db = require('mongodb').Db,
	MongoClient = require('mongodb').MongoClient,
	Server = require('mongodb').Server,
	ObjectID = require('mongodb').ObjectID;

var dbName = "recDB";
var dbPort = mongodb.Connection.DEFAULT_PORT;

var newsCol = 'news';

var _db = new Db(dbName, new Server('localhost', dbPort), {safe: true}); //what is safe?


/*
db.open(function(err, db) {

	var collection = db.collection(testCollection);
	collection.find(function(err, cursor) {
		cursor.toArray(function(err, collection) {
			console.log(collection);
		});
	});
});
*/

//related to the news collection
exports.newsCollection = function(callback) {
	_db.open(function(err, db) {
		var collection = db.collection(newsCol, function(err, collection) {
			collection.find(function(err, cursor) {
			cursor.toArray(function(err, collection) {
				callback(collection);
				db.close();
			});
		});
		});
		
	});
}

//removes the element with the ID and returns the ID
//callback has two parameters: error and isRemoved
exports.removeNewsElementWithID = function(mongoID, callback) {
	
	//NOTE: db.close() should be nested inside the callback functions
	//so that the database does not close before operations are complete!!!
	_db.open(function(err, db) {
		console.log("Inside method with error " + err);
		var parsedID = new ObjectID.createFromHexString(mongoID);
		db.collection(newsCol, function(err, collection) {
			console.log("Inside collection method with err " + err);
			collection.remove({_id : parsedID}, {w: 1}, function(err, numberRemoved) {
				console.log("number removed is " + numberRemoved);
				if (numberRemoved === 1) {
					callback(err, mongoID);
				} else {
					callback(err, null);
				}
				db.close();
			});
		});
	});
};

//callback function takes a parameter of err and the documents 
//new id that was created
exports.addNewsElement = function(model, callback) {
	

	_db.open(function(err, db) {
		db.collection(newsCol, function(err, collection) {

			collection.insert(model, {w:1}, function(err, doc) {

				callback(err, doc._id);
				db.close();

			});
		});
		
	});
}