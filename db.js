//closure to protect namespace
(function(exports) {

	//import modules
	var mongodb = require('mongodb'),
	Db = require('mongodb').Db,
	MongoClient = require('mongodb').MongoClient,
	Server = require('mongodb').Server,
	ObjectID = require('mongodb').ObjectID,

	//other variables
	MONGODB_URL,
	Collections = {
		users: 'users',
		news: 'news',
		hours: 'hours',
		groupFitness: 'groupFitness'
	},
	renderProperties = {
		GF: {
		 	//related to both
			type: true,
			startDate: true,
			endDate: true,
			//related to GFClass
			className: true,
			instructor: true,
			timeRange: true,
			dayOfWeek: true,
			cancelledDates: true,
			specialDateClass: true,
			//related to SpecialDate
			title: true
		}
	};


	//this function must be called before any subsequent function in this module
	//can work.  The MONGO_URL must be set before DB calls are made
	exports.setURL = function(MONGO_URL) {
		MONGODB_URL = MONGO_URL;
	}


	//related to authentication
	exports.login = function(username, password, callback) {
		console.log(username + " " + password);
		Db.connect(MONGODB_URL, function(err, db) {
			db.collection(Collections.users, function(err, collection) {
				collection.find({username: username, password: password}, {username: true, userID: true}, function(err, cursor) {
					cursor.toArray(function(err, collection) {
						if (err || collection.length === 0) {
							console.log("found nothing; error is "+err+" and collection is "+collection);
							callback(false, null);
						} else {
							console.log("found something, collection is "+collection);
							callback(true, collection[0]);
						}
						db.close();
					});
				});
			});
		});
	};

	//related to the news collection
	exports.newsCollection = function(callback) {
		// Set up the connection to the local db

		// Open the connection to the server
		
		Db.connect(MONGODB_URL, function(err, db) {
	  		// Get the first db and do an update document on it
	  		
	  		db.collection(Collections.news, function(err, collection) {

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
		//so that the database does not close before operations are complete!!
		Db.connect(MONGODB_URL, function(err, db) {

			var parsedID = new ObjectID.createFromHexString(mongoID);
			db.collection(Collections.news, function(err, collection) {
				
				collection.remove({_id : parsedID}, {w: 1}, function(err, numberRemoved) {
					
					if (err) {
						callback(err, null);
					}
					if (numberRemoved === 1) {
						callback(err, mongoID);
					} else {
						callback(new Error("Did not remove 1 element from the database"), null);
					}
					db.close();
				});
			});
		});
	};

	//callback function takes a parameter of err and the documents 
	//new id that was created
	exports.addNewsElement = function(model, callback) {
		
		Db.connect(MONGODB_URL, function(err, db) {
			db.collection(Collections.news, function(err, collection) {

				//returns an array of the documents that were added, with the
				//_id added to the JSON object, there should only be 1 document 
				//added at a time
				collection.insert(model, {w:1}, function(err, docs) {
					callback(err, docs[0]);
					db.close();

				});
			});
		});
	}

	//callback function takes parameters of the error message and the document
	//that was updated
	exports.updateNewsElement = function(model, callback) {
		
		Db.connect(MONGODB_URL, function(err, db) {
			
			var parsedID = new ObjectID.createFromHexString(model._id);

			db.collection(Collections.news, function(err, collection) {
				
				collection.update(
					{_id: parsedID}, //selector
					{ //updated properties
						priorityNumber: model.priorityNumber,
						description: model.description
					},
					{w: 1, upsert: true}, function(err, doc) {

					
					callback(err, doc);
					db.close();
				});
			});
		});
	};


	exports.hoursCollection = function(callback) {
		Db.connect(MONGODB_URL, function(err, db) {
			db.collection(Collections.hours, function(err, collection) {
				collection.find(function(err, cursor) {
					cursor.toArray(function(err, collection) {
						callback(collection);
					});
				});
			}); 
		});
	};

	exports.updateHours = function(hours, callback) {
		var parsedID = new ObjectID.createFromHexString(hours._id);
		Db.connect(MONGODB_URL, function(err, db) {
			db.collection(Collections.hours, function(err, collection) {
				collection.update({_id: parsedID}, 
				{
					name: hours.name,
					priorityNumber: hours.priorityNumber,
					startDate: hours.startDate,
					endDate: hours.endDate,
					times: hours.times,
					facilityHours: hours.facilityHours,
					closedHours: hours.closedHours

				}, function(err, numberUpdated) {
					console.log("About to call callback");
					callback(err, hours);
					db.close();
				});
			});
		});
	};

	exports.createHours = function(hours, callback) {
		Db.connect(MONGODB_URL, function(err, db) {
			db.collection(Collections.hours, function(err, collection) {
				collection.insert(hours, function(err, docs) {
					callback(err, docs[0]);
					db.close();
				});
			});
		});
	};

	exports.deleteHours = function(hoursID, callback) {
		var parsedID = new ObjectID.createFromHexString(hoursID);
		Db.connect(MONGODB_URL, function(err, db) {
			db.collection(Collections.hours, function(err, collection) {
				collection.remove({_id: parsedID}, {w:1}, function(err, numberRemoved) {
					var error;
					if (err) {
						error = err;
					} else if (numberRemoved !== 1) {
						error = new Error("Removed " + numberRemoved + " documents when 1 was supposed to be removed");
					}

					callback(error, hoursID);
					db.close();
				});
			});
		});
	}

	exports.allGFObjects = function(callback) {
		Db.connect(MONGODB_URL, function(err, db) {
			db.collection(Collections.groupFitness, function(err, collection) {

				//only want to render some of the stored JSON
				//other JSON that is not rendered is in place 
				//to make queries easier
				collection.find({}, renderProperties.GF, function(err, cursor) {
					cursor.toArray(function(err, collection) {
						callback(err, collection);
						db.close();
					});
				});
			});
		});
	}


	exports.GFClassesForDates = function(monthCount, callback) {

		var dateQuery = {
			'type': 'GFClass',
			'SD_monthCount': {$lte: monthCount},
			$or: [
				{'ED_monthCount': {$gte: monthCount}},
				{'ED_monthCount': 0}
			]
			
		};

		Db.connect(MONGODB_URL, function(error, db) {

			db.collection(Collections.groupFitness, function(err, collection) {
				collection.find(dateQuery, renderProperties.GF, function(err, cursor) {
					cursor.toArray(function(err, collection) {
						callback(err, collection);
						db.close();
					});
				});
			});
		});
	};

	exports.GFSpecialDates = function(callback) {

		var SDQuery = {'type': 'GFSpecialDate'};

		Db.connect(MONGODB_URL, function(err, db) {
			db.collection(Collections.groupFitness, function(err, collection) {
				collection.find(SDQuery, renderProperties.GF, function(err, cursor) {
					cursor.toArray(function(err, collection) {
						callback(err, collection);
						db.close();
					});
				});
			});
		});
	};
	//for updating a GF object
	//returns err and the updated object to the callback function
	exports.updateGFClass = function(object, callback) {
		var parsedID = new ObjectID.createFromHexString(object._id);
		Db.connect(MONGODB_URL, function(err, db) {
			db.collection(Collections.groupFitness, function(err, collection) {
				collection.update({_id: parsedID},
					{
						type: object.type,
						className: object.className,
						instructor: object.instructor,
						startDate: object.startDate,
						endDate: object.endDate,
						SD_monthCount: object.SD_monthCount,
						ED_monthCount: object.ED_monthCount,
						dayOfWeek: object.dayOfWeek,
						timeRange: object.timeRange,
						cancelledDates: object.cancelledDates,
						specialDateClass: object.specialDateClass

					}, function(err, numberUpdated) {
						if (err) {
							callback(err, null);
						} else {
							callback(null, {
								className: object.className,
								instructor: object.instructor,
								startDate: object.startDate,
								endDate: object.endDate,
								dayOfWeek: object.dayOfWeek,
								timeRange: object.timeRange
							});
						}
						db.close();
					});

			});
		});
	}

	//inserts the object then returns the object as a mongodb object
	//with a server_size _id attribute, the callback function takes the arguments
	//of any error and the returned mongodb object
	exports.insertGFClass = function(object, callback) {
		Db.connect(MONGODB_URL, function(err, db) {
			db.collection(Collections.groupFitness, function(err, collection) {
				collection.insert(object, {w:1}, function(err, docs) {
					var visibleDoc = {
						_id: docs[0]._id,
						className: docs[0].className,
						timeRange: docs[0].timeRange,
						instructor: docs[0].instructor,
						startDate: docs[0].startDate,
						endDate: docs[0].endDate,
						dayOfWeek: docs[0].dayOfWeek
					};
					callback(err, visibleDoc);
					db.close();

				});
			});
		});
	}

	exports.insertGFSpecialDate = function(object, callback) {
		Db.connect(MONGODB_URL, function(err, db) {
			db.collection(Collections.groupFitness, function(err, collection) {
				collection.insert(object, {w:1}, function(err, docs) {
					//unlike GFClasses, the whole document
					//for a special date will be visible, there are
					//no special variables used for querying
					callback(err, docs[0]);
					db.close();
				});
			});
		});
	}

	exports.deleteGFObjectWithID = function(id, callback) {
		var parsedID = new ObjectID.createFromHexString(id);
		Db.connect(MONGODB_URL, function(err, db) {
			db.collection(Collections.groupFitness, function(err, collection) {
				collection.remove({_id: parsedID}, {w: 1}, function(err, numberRemoved) {
					if (err) {
						console.log(err);
						callback(err, null);
					} else if (numberRemoved === 1) {
						callback(null, id);
					} else {
						callback(new Error("did not remove 1 element"), null);
					}
					db.close();
				});
			});
		});
	};

})(exports);