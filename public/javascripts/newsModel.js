


//model
var NewsEvent = Backbone.Model.extend({

	description: '',
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
	//0-based index used to generate model id's
	eventHistoryCount: 0,

	enqueue: function() {
		var newEvent = new NewsEvent(
			{
				description: 'Here is the default adding description',
				id: this.eventHistoryCount,
			}
		);

		var newEventView = new NewsEventView({model: newEvent});
		this.unshift(newEvent);
		this.eventHistoryCount++;
	},
	getEventAtIndex: function(index) {
		
		return this.models[index];
	},
	//redetermines the order of the array based on an
	//array of ids, which are the ids of the current
	//elements in the li
	resortArray: function(ids) {
		var newModels = [];
		ids.forEach(function(id) {
			newModels.push(this.get(id));
		}, this);
		this.models = newModels;
	}
	
	
});

//script starts here

var eventCollection = new NewsEvents();



