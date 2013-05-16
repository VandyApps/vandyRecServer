


//model
var NewsEvent = Backbone.Model.extend({

	
	idAttribute: "_id",
	description: '',
	author: '',
	index: 0,
	priorityNumber: 0,
	url: '/news',

	initialization: function() {
		this.on('change', function() {
			console.log("do something because of change");
		});
	},
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
		this.saveAndUpdate();
	},
	getPriorityNumber: function() {
		return this.get('priorityNumber');
	},
	setPriorityNumber: function(newPriorityNumber) {
		this.set({'priorityNumber': newPriorityNumber});
		this.saveAndUpdate();
	},
	//should call this method instead of save
	//any customization to save process should go in here
	saveAndUpdate: function() {
		
		this.save(
		{},
		{
			error: function() {
				alert('There was an error saving your updates to the server');
			}
		});
		
		
	}
	
});

//the first element in the list is at the 0 index
//of the model and the last element is at the last 
//index of the model
var NewsEvents = Backbone.Collection.extend({
	model: NewsEvent,
	
	//url to retrieve data from
	url: '/JSON/news',


	//comparator for sorting is based on the priority number of the event
	comparator: function(event) {
		return event.getPriorityNumber();
	},
	//this method is for adding and generating brand new models to the
	//collection
	enqueue: function() {
		var newEvent = new NewsEvent(
			{
				description: 'Here is the default adding description',
				author: 'No author'
			}
		);

		//var newEventView = new NewsEventView({model: newEvent});
		this.unshift(newEvent);
		this.resetPriorityNumbers();
		return newEvent;
	},
	//index must be of type number
	getEventAtIndex: function(index) {
		
		return this.models[index];
	},
	//this is the cid of the backbone model
	getEventWithID: function(id) {
		var eventModel;
		
		this.models.forEach(function(event) {
			
			if (event.cid === id) {
				
				eventModel = event;
				return;
			}
		});
		return eventModel;
	},
	//sets the priority number of the event with the id to
	//new priority number that is passed in
	setPriorityNumberForEventWithID: function(id, priorityNumber) {
		this.getEventWithID(id).setPriorityNumber(priorityNumber);
	},
	//redetermines the order of the array based on an
	//array of ids, which are the ids of the current
	//elements in the li
	resortArray: function(ids) {
		console.log(ids);
		for (var index in ids) {
			this.setPriorityNumberForEventWithID(ids[index], index);
		}
		//sorts based on priority numbers, according to 
		//the comparator function that is overriden above
		this.sort(); 
	},
	//use this method instead of push so that other configurations
	//can be taken care of
	//this method is for adding elements to the collection that already exist
	//event should already have an ID and a description
	back: function(event) {
		
		this.models.push(event);
	},
	delete: function(eventID) {
		var deletedEvent = this.getEventWithID(eventID);
		var idToDelete;

		deletedEvent.destroy(
			{
				headers: { _id: deletedEvent.id },
				error: function() {alert("There was an error when deleting this event from the server");}
			}
		);
		//this.remove(deletedEvent);
		
	},
	//pass in data from the server for a single event
	//adds the data to the end of the models array
	create: function(eventData) {

		var newNewsEvent = new NewsEvent(
			{
				description: eventData.description,
				author: eventData.author,
				priorityNumber: eventData.priorityNumber
			}
		)
		this.models.push(newNewsEvent);
		return newNewsEvent;
	},
	//resets the priority numbers of the models in the 
	//collection to match the current order the elements are in
	resetPriorityNumbers: function() {
		//must reset the priority number in each of the models
		for (var nextIndex in this.models) {
			this.models[nextIndex].setPriorityNumber(nextIndex);
			this.models[nextIndex].saveAndUpdate();
		}

	}
	
	
	
});

//script starts here

//create collection variable
window.eventCollection = new NewsEvents();





