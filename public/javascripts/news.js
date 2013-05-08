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

var NewsTableView = Backbone.View.extend({

	el: '#table',

	initialize: function() {

	},
	front: function(tableViewElement) {
		//adds the table view element to the beginning of the table
	},
	back: function(tableViewElement) {
		//adds the table view element to the end of the table
		this.$el.append(tableViewElement);
		
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
		this.$el.addClass('tableElement');
		this.$el.append("<div class='button remove'>Remove</div>");
		this.$el.append("<div class='button edit'>Edit</div>");
		this.$el.append("<div class='description'>" + this.model.get('description') + '</div>');
		var table = new NewsTableView().back(this.$el);

		this.$el.draggable(
			{
				cursor: 'move',
				containment: '#table'
			}
		);
	},
	edit: function() {
		//allows changes to be made to the model's description
		alert('about to edit the element');
	},
	delete: function() {
		//deletes the model and removes the element from the view
		alert('about to delete the element');
	}
});

//script starts here
var testEvent = new NewsEvent({description: "This is the description for an event"});
var testView = new NewsEventView({model : testEvent});

var anotherTestEvent = new NewsEvent({description: "This is a second description for an event"});
var anotherTestView = new NewsEvent({model: anotherTestEvent});


