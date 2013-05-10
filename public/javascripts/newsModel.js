


//model
var NewsEvent = Backbone.Model.extend({

	description: '',
	index: 0,
	id: 0,

	initialize: function() {
		
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
	}
});

//the first element in the list is at the 0 index
//of the model and the last element is at the last 
//index of the model
var NewsEvents = Backbone.Collection.extend({
	model: NewsEvent,
	//0-based index used to generate model id's
	eventHistoryCount: 0,

	initialize: function() {
		
	},
	enqueue: function() {
		var newEvent = new NewsEvent(
			{
				description: 'Here is the default adding description',
				id: this.eventHistoryCount,
			}
		);

		var newEventView = new NewsEventView({model: newEvent});
		this.models.unshift(newEvent);
		this.eventHistoryCount++;
		console.log(this.models);
	},
	getEventAtIndex: function(index) {
		
		return this.models[index];
	},
	//redetermines the order of the array based on the current
	//order of the list items
	resortArray: function() {

	}
	
	
});

//script starts here

window.eventCollection = new NewsEvents([]);




