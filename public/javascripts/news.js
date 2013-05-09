//model

var NewsEvent = Backbone.Model.extend({

	description: '',
	index: 0,

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

	description: function(newDescription) {

		this.description = newDescription;
	}
});

//view
var NewsTableView = Backbone.View.extend({

	el: '#table',

	initialize: function() {
		
		this.$el.sortable(
			{
				update: function(event, ui) {
				}
			}
		);

		//this.$el.children('.tableViewElement').on('sortreceive', (this.elementMoved).bind(this));
		
	},
	front: function(tableViewElement) {
		//adds the table view element to the beginning of the table
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

	events: {
		'dblclick .description': 'edit',
		'click .edit': 'edit',
		'click .remove': 'delete'
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
		var table = new NewsTableView().back(this.$el);

		

		//add events for drag and drop
	},
	edit: function() {
		//allows changes to be made to the model's description
		
		if (this.$el.children('.edit').text() === 'Edit') {
			var descriptionElement = this.$el.children('.description');
			var currentText = descriptionElement.text();
			descriptionElement.remove();

			this.$el.append("<textarea class='description'>"+currentText+"</textarea>");
			this.$el.children('textarea').select();
			this.$el.children('.edit').text('Done');
		} else {
			this.$el.children('.edit').text('Edit');
			var textareaElement = this.$el.children('.description');
			var textareaText = textareaElement.val();
			textareaElement.remove();

			this.$el.append("<div class='description'>"+textareaText+"</div>");
		}
		
	},
	delete: function() {
		//deletes the model and removes the element from the view
		this.$el.remove();
	}
});


//script starts here
var testEvent = new NewsEvent({description: "This is the description for an event"});
var testView = new NewsEventView({model : testEvent});

var anotherTestEvent = new NewsEvent({description: "This is a second description for an event"});
var anotherTestView = new NewsEventView({model: anotherTestEvent});

var andAnotherTestEvent = new NewsEvent({description: "this is a third description for an event that is happenning at the rec center"});
var andAnotherTextView = new NewsEventView({model: andAnotherTestEvent});

