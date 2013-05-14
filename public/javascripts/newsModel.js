


//model
var NewsEvent = Backbone.Model.extend({

	description: '',
	author: '',
	index: 0,
	id: 0,

	index: function() {

		return this.index;
	},
	incrementIndex: function() {
		this.index += 1;
	},
	decrementIndex: function() {
		this.index -= 1;
	},
	setIndex: function(newIndex) {
		this.index = newIndex;
	},
	getDescription: function() {
		return this.get('description');
	},
	setDescription: function(description) {
		this.set({'description': description});
	}
});

//the first element in the list is at the 0 index
//of the model and the last element is at the last 
//index of the model
var NewsEvents = Backbone.Collection.extend({
	model: NewsEvent,
	//this variable holds the next ID available to assign to an event
	IDOnQueue: 0,

	//this method is for adding and generating brand new models to the
	//collection
	enqueue: function() {
		var newEvent = new NewsEvent(
			{
				description: 'Here is the default adding description',
				author: 'No author',
				id: this.IDOnQueue
			}
		);

		//var newEventView = new NewsEventView({model: newEvent});
		this.unshift(newEvent);
		this.IDOnQueue++;
		return newEvent;
	},
	getEventAtIndex: function(index) {
		
		return this.models[index];
	},
	getEventWithID: function(id) {
		var eventModel;
		console.log("Checking for id " + id + " of type " + typeof id);
		this.models.forEach(function(event) {
			console.log("ID is " + event.get('id') + " and type of Id is " + typeof event.get('id'));
			if (event.get('id') === id) {
				console.log('found the model');
				eventModel = event;
				return;
			}
		});
		return eventModel;
	},
	//redetermines the order of the array based on an
	//array of ids, which are the ids of the current
	//elements in the li
	resortArray: function(ids) {
		var newModels = [];
		ids.forEach(function(id) {
			console.log("for each loop running on id:" + id);
			console.log("Found the event for this id" + this.getEventWithID(id));
			newModels.push(this.getEventWithID(id));
		}, this);
		console.log(JSON.stringify(newModels));
		this.reset(newModels);
	},
	//use this method instead of push so that other configurations
	//can be taken care of
	//this method is for adding elements to the collection that already exist
	//event should already have an ID and a description
	back: function(event) {
		
		this.models.push(event);
	},
	delete: function(eventID) {
		this.remove(this.getEventWithID(eventID));
	},
	//pass in data from the server for a single event
	//adds the data to the end of the models array
	create: function(eventData) {

		var eventID = eventData.newsID;
		console.log(this.IDOnQueue);
		if (eventID >= this.IDOnQueue) {
			this.IDOnQueue = eventID + 1;
		}
		
		var newNewsEvent = new NewsEvent(
			{
				description: eventData.description,
				author: eventData.author,
				id: eventData.newsID
			}
		)
		this.models.push(newNewsEvent);
		var newEventView = new NewsEventView({model: newNewsEvent});
		return newNewsEvent;
	}
	
	
});




//script starts here

//create collection variable
window.eventCollection = new NewsEvents();




