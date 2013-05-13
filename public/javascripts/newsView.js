

//view can see the model

var NewsTableView = Backbone.View.extend({

	el: '#table',
	animate: true,

	initialize: function() {
		
		this.$el.sortable();

		//add filter (2nd argument) so that this method is not called
		//on every single element in the table view whenever sortupdate
		//event is called.  The result of calling it on any element in the
		//table view will be the same, only need to call it once
		this.$el.on("sortupdate", this.$el.children()[0], {element: this.$el}, function(event, ui) {
			//iterate through li of table view and construct an array
			//to pass to the collection
			var arrayOfIds = [];
			event.data.element.children().toArray().forEach(function(child) {

				arrayOfIds.push($(child).attr("id"));
			}, arrayOfIds);
			eventCollection.resortArray(arrayOfIds);
		});
		
	},
	front: function(tableViewElement) {
		//adds the table view element to the beginning of the table
		this.$el.prepend(tableViewElement);

	},
	back: function(tableViewElement) {
		//adds the table view element to the end of the table
		this.$el.append(tableViewElement);
		
	},
	toggleAnimate: function() {
		if (this.animate) {
			this.animate = false;
		} else {
			this.animate = true;
		}
	},
	shouldAnimate: function() {
		return this.animate;
	}


});

//create the instance of the table view
var tableView = new NewsTableView();

//view
var NewsEventView = Backbone.View.extend({

	tagName: 'li',
	id: '',
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
		this.$el.attr("id", this.model.id);
		this.$el.addClass('tableElement');
		this.$el.append("<div class='button edit'>Edit</div>");
		this.$el.append("<div class='button remove'>Remove</div>");
		this.$el.append("<div class='description'>" + this.model.get('description') + '</div>');
		//note that the new keyword does not make a new instance of 
		//the table view because the table view has an element that 
		//already exists in the html
		if (tableView.shouldAnimate()) {
			this.$el.hide();
		}
		var table = new NewsTableView().front(this.$el);
		if (tableView.shouldAnimate()) {
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
		if (tableView.shouldAnimate()) {
			this.$el.slideUp(300, function() {
				$(this).remove();
			});
		} else {
			this.$el.remove();
		}	
	},
	onEnter: function(event) {
		if (editMode && event.which === 13) {
			this.edit();
		}
	}
});


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

//add event to animate button
var animateButton = $('#animate');
animateButton.mousedown(function() {
	$(this).css({'color': 'white', 'backgroundColor': 'black'})
});
animateButton.mouseup(function() {
	if (!tableView.shouldAnimate()) {
		//change the button from green to red
		$(this).css(
			{
				'backgroundColor': '#38b331',
				'border': 'solid 3px #226b1d'
			}
		);
	} else {
		//change the button from red to green
		$(this).css(
			{
				'backgroundColor': '#da3320',
				'border': 'solid 3px #952316'
			}
		);
	}
	$(this).css({'color': 'black'});
});
animateButton.click(function() {
	tableView.toggleAnimate();
});
