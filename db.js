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
		var collection = db.collection(newsCol);
		collection.find(function(err, cursor) {
			cursor.toArray(function(err, collection) {
				callback(collection);
				db.close();
			});
		});
	});
}

//removes the element with the ID and returns the ID
//callback has two parameters: error and isRemoved
exports.removeNewsElementWithID = function(mongoID, callback) {
	var parsedID = new ObjectID.createFromHexString(mongoID);
	var collection = db.collection(newsCol);

	_db.open(function(err, db) {
		
		collection.remove({_id: parsedID}, function(err, numberRemoved) {
			callback(err, numberRemoved === 1);
		});
		db.close();
	});
};

//callback function takes a parameter of the news element as a JSON
//object that was created by the DB, it will include a _id property
exports.addNewsElement = function(model, callback) {
	

	_db.open(function(err, db) {
		var collection = db.collection(newsCol);
		collection.insert(model, {w:1}, function(err, result) {
			console.log(JSON.stringify(result));
			callback(err, null);

		});
	});
}