var mongodb = require('mongodb'),
	Db = require('mongodb').Db,
	MongoClient = require('mongodb').MongoClient,
	Server = require('mongodb').Server;

var dbName = "recDB";
var dbPort = mongodb.Connection.DEFAULT_PORT;

var newsCollection = 'news';

console.log(dbPort);
db = new Db(dbName, new Server('localhost', dbPort), {safe: true}); //what is safe?


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
exports.newsCollection = function(callback) {
	db.open(function(err, db) {
		var collection = db.collection(newsCollection);
		collection.find(function(err, cursor) {
			cursor.toArray(function(err, collection) {
				callback(collection);
				db.close();
			});
		});
	});
}