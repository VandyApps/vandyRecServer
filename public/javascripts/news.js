


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
	}
	
	
});

//view
var NewsTableView = Backbone.View.extend({

	el: '#table',

	initialize: function() {
		
		this.$el.sortable(
			{
				update: function(event, ui) {
					console.log("This method was called");
				}
			}
		);

		//this.$el.children('.tableViewElement').on('sortreceive', (this.elementMoved).bind(this));
		
	},
	front: function(tableViewElement) {
		//adds the table view element to the beginning of the table
		this.$el.prepend(tableViewElement);

	},
	back: function(tableViewElement) {
		//adds the table view element to the end of the table
		this.$el.append(tableViewElement);
		
	},
	elementMoved: function(ui, event) {

		console.log('element moved was called');
	}


});

var NewsEventView = Backbone.View.extend({

	tagName: 'li',
	className: 'tableElement',
	editMode: false,
	animateEnqueue: true,
	animateDequeue: true,

	events: {
		'dblclick .description': 'edit',
		'click .edit': 'edit',
		'click .remove': 'delete',
		'keydown .description': 'onEnter'
	},
	initialize: function() {
		
		this.render();
	},
	render: function() {
		//do thie rendering stuff here with the template

		//append adds elements within the li, appended to one another
		this.$el.addClass('tableElement');
		this.$el.append("<div class='button edit'>Edit</div>");
		this.$el.append("<div class='button remove'>Remove</div>");
		this.$el.append("<div class='description'>" + this.model.get('description') + '</div>');
		//note that the new keyword does not make a new instance of 
		//the table view because the table view has an element that 
		//already exists in the html
		if (this.animateEnqueue) {
			this.$el.hide();
		}
		var table = new NewsTableView().front(this.$el);
		if (this.animateEnqueue) {
			this.$el.slideDown({duration:300});
		}
		

		//add events for drag and drop
	},
	edit: function() {
		//allows changes to be made to the model's description
		if (this.$el.children('.edit').text() === 'Edit') {
			this.$el.children('.description').remove();

			this.$el.append("<textarea class='description'>"+this.model.getDescription()+"</textarea>");
			var textarea = this.$el.children('textarea');
			//hilight the text area
			textarea.select(); 
			//bind the edit event to the text area
			
			this.$el.children('.edit').text('Done');
			editMode = true;
			
		} else {
			this.$el.children('.edit').text('Edit');
			var textareaElement = this.$el.children('.description');

			this.model.setDescription(textareaElement.val());
			var textareaText = textareaElement.val();
			textareaElement.remove();

			this.$el.append("<div class='description'>"+textareaText+"</div>");
			editMode = false;
		}
		
	},
	delete: function() {
		//deletes the model and removes the element from the view
		if (this.animateDequeue) {
			this.$el.slideUp(300, function() {
				this.$el.remove();
			});
		}	else {
			this.$el.remove();
		}	
	},
	onEnter: function(event) {
		if (editMode && event.which === 13) {
			this.edit();
		}
	}
});

//script starts here

window.eventCollection = new NewsEvents([]);
//add event to the add button 
var addButton = $('#add');
addButton.mousedown(function() {
	$(this).css({'backgroundColor': 'black', 'color': 'white'});
});
addButton.mouseup(function() {
	$(this).css({'backgroundColor' : 'white', 'color': 'black'});
});
addButton.click({collection : eventCollection}, function(event) {
	//pass in the event as a parameter
	//the event contains a data property, which is the object
	//passed in
	event.data.collection.enqueue();
});




