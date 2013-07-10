
var NewsView = {};
//view can see the model

NewsView.NewsTableView = Backbone.View.extend({

	el: '#table',
	animate: true,
	//this is set to false after the first time
	//the render method has been called
	initialLoad: true,
	//this is a list of all table view elements
	//these elements are not in any significant
	//ordering
	items: [],

	initialize: function() {
		
		this.$el.sortable();

		//add filter (2nd argument) so that this method is not called
		//on every single element in the table view whenever sortupdate
		//event is called.  The result of calling it on any element in the
		//table view will be the same, only need to call it once
		this.$el.on("sortupdate", this.$el.children()[0], {element: this.$el}, function(event, ui) {
			//iterate through li of table view and construct an array
			//if ID's to pass to the collection
			var arrayOfIds = [];
			event.data.element.children().toArray().forEach(function(child) {
				this.push($(child).attr('id'));
			}, arrayOfIds);
			eventCollection.resortArray(arrayOfIds);
		});
	
		
	},
	front: function(view) {
		if (this.shouldAnimate()) {
			view.$el.hide();
		}
		//adds the table view element to the beginning of the table
		this.$el.prepend(view.$el);
		if (this.shouldAnimate()) {
			view.$el.slideDown(300);
		}
		view.on('editOn', this.editModeOn, this);
		this.items.push(view);
		this.sortItems();
	},
	back: function(view) {
		if (this.shouldAnimate()) {
			view.$el.hide();
		}
		//adds the table view element to the end of the table
		this.$el.append(view.$el);
		if (this.shouldAnimate()){
			view.$el.slideDown(300);
		}
		view.on('editOn', this.editModeOn, this);
		this.items.push(view);
		this.sortItems();
		
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
	},
	removeAllElements: function() {
		if (this.animate) {
			this.$el.children().slideUp(400, function() {
				$(this).remove();
			});
		} else {
			this.$el.children().remove();
		}
		this.items = [];
	},
	//iterate through the elements in order
	//and perform some operation on them in
	//the callback function
	//the callback function is passed the element
	//as a DOM elements
	iterate: function(callback, receiver) {
		if (receiver !== undefined) {

			this.items.forEach(callback.bind(receiver));
		} else {
			this.items.forEach(callback);
		}
	},
	//called when one of the elements enters edit
	//mode, this method is used to remove any other
	//element from edit mode so that only 1 element
	//at a time is in edit mode
	editModeOn: function(view) {
		this.iterate(function(_view) {
			if (_view !== view && _view.isEditing()) {
				_view.toggleEdit();
			}
		});
	},
	sortItems: function() {
		this.items.sort(function(view1, view2) {
			return view1.model.getPriorityNumber() - view2.model.getPriorityNumber();
		});
	}
});

//create the instance of the table view
//eventually make singleton instance
var tableView = new NewsView.NewsTableView();

//view
NewsView.NewsEventView = Backbone.View.extend({

	tagName: 'li',
	id: '',
	className: 'tableElement',
	editMode: false,
	//if this is false, then elements are prepended to the table view
	appendToTableView: false,

	events: {
		'dblclick .description': 'toggleEdit',
		'click .edit': 'toggleEdit',
		'click .remove': 'delete',
		'keydown .description': 'onEnter'
	},
	initialize: function(attrs) {

		this.render();
	},
	render: function() {
		//do thie rendering stuff here with the template

		//append adds elements within the li, appended to one another
		this.$el.attr("id", this.model.cid);
		this.$el.append("<div class='button edit'>Edit</div>");
		this.$el.append("<div class='button remove'>Remove</div>");
		this.$el.append("<div class='description'>" + this.model.getDescription() + '</div>');
		
		//note that the new keyword does not make a new instance of 
		//the table view because the table view has an element that 
		//already exists in the html
		/*
		if (tableView.shouldAnimate()) {
			this.$el.hide();
		}
		
		if (this.appendToTableView) {
			tableView.back(this.$el);
		} else {
			tableView.front(this.$el);
		}
		
		if (tableView.shouldAnimate()) {
			this.$el.slideDown({duration:300});
		}
		*/
	},
	toggleEdit: function() {
		//allows changes to be made to the model's description
		if (!this.editMode) {
			this.$el.children('.description').remove();

			this.$el.append("<textarea class='description'>"+this.model.getDescription()+"</textarea>");
			var textarea = this.$el.children('textarea');
			//hilight the text area
			textarea.select(); 
			//bind the edit event to the text area
			
			this.$el.children('.edit').text('Done');
			this.editMode = true;

			this.trigger('editOn', this);
			
		} else {
			this.$el.children('.edit').text('Edit');
			var textareaElement = this.$el.children('.description');

			this.model.setDescription(textareaElement.val());
			var textareaText = textareaElement.val();
			textareaElement.remove();

			this.$el.append("<div class='description'>"+textareaText+"</div>");
			this.editMode = false;
			//wait 1 second before saving to the server, to make sure
			//everything is set
			this.trigger('editOff', this);
		}
		
	},
	isEditing: function() {
		return this.editMode;
	},
	delete: function() {
		//deletes the model and removes the element from the view
		//remove the element from the collection
		var confirm = new ConfirmationBox(
		{
			message: 'Are you sure you want to delete this news event?',
			button1Name: 'YES',
			button2Name: 'NO',
			animate: false,
			deleteAfterPresent: true
		});
		confirm.show(false);
		var that = this;
		confirm.on('clicked1', function() {
			eventCollection.delete(that.$el.attr('id'));
			if (tableView.shouldAnimate()) {
				that.$el.slideUp(300, function() {
					$(that).remove();
				});
			} else {
				that.$el.remove();
			}	
		});
		
	},
	onEnter: function(event) {
		if (this.editMode && event.which === 13) {
			this.toggleEdit();
		}
	}
});


//add event to the add button 
var addButton = $('#add_news');
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

	var newEvent = event.data.collection.enqueue();
	var newsEventView = new NewsView.NewsEventView({model: newEvent});
	tableView.front(newsEventView);
});


//add event to animate button
var animateButton = $('#animate_news');
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


