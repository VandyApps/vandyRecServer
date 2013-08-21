var GFView = {};

//this is not really a backbone view in that it has not real models but helps 
//delegate the display of models in a separate window
GFView.BlockView = Backbone.View.extend({

	//the day to display
	day: 0,
	//row and column on the calendar grid
	column: 0,
	row: 0,
	//empty block defaults to false
	//empty means that this block does not represent a valid date
	empty: false,
	//the number of fitness classes to be held on this day
	fitnessClassesForBlock: [],
	specialDate: undefined,

	events: {

		'mouseenter.dayBlock': 'hoverOn',
		'mouseleave.dayBlock': 'hoverOff',
		'click.dayBlock': 'showForm'
	},
	
	initialize: function(options) {
		//set the variables
		var columnsSelector, rowSelector;
		this.row = options.row;
		this.column = options.column;

		columnSelector = "#cal-column-" + this.column;
		rowSelector = ".cal-block-" + this.row;

		this.$el = $(columnSelector).children(rowSelector);

		if (options.empty === true) {
			this.empty = true;

		} else {
			this.empty = false;
			this.day = options.day;
			this.fitnessClassesForBlock = options.fitnessClassesForBlock;
		}

		this.specialDate = options.specialDate;
		
		this.render();
		
	},
	
	render: function() {
		
		if (this.empty) {
			this.$el.attr('empty', 'empty');
		}

		$('.specialDayIndicator', this.$el).remove();
		if (this.specialDate !== undefined) {
			this.$el.addClass('specialDay');
			this.$el.append('<div class="specialDayIndicator">'+this.specialDate.getTitle()+'</div>');
		} else {
			this.$el.removeClass('specialDay');
			
		}

		this.$el.append('<div class="dayIndicator">'+this.day+'</div>');
		if (this.fitnessClassesForBlock.length === 1) {

			this.$el.append('<div class="classCountIndicator">1 Class</div>');

		} else if (this.fitnessClassesForBlock.length > 1) {
			this.$el.append('<div class="classCountIndicator">'+this.fitnessClassesForBlock.length+" Classes</div>");

		} else {
			this.$el.append('<div class="classCountIndicator"><div>');
		}
		
	},
	//for resetting the view for another date 
	//without removing it
	reset: function(options) {
		//set the variables
		var columnSelector, rowSelector;
		this.row = options.row;
		this.column = options.column;

		columnSelector = "#cal-column-" + this.column;
		rowSelector = ".cal-block-" + this.row;

		this.$el = $(columnSelector).children(rowSelector);
		if (options.empty === true) {
			this.empty = true;
			this.$el.attr('empty', 'empty');

		} else {
			this.empty = false;
			this.day = options.day;
			this.fitnessClassesForBlock = options.fitnessClassesForBlock;
		}
		this.specialDate = options.specialDate;
		this.rerender();

	},

	rerender: function() {
		this.$el.removeAttr('style');
		if (this.empty) {
			this.$el.attr('empty', 'empty');
		} else {
			this.$el.removeAttr('empty');
		}

		$('.specialDayIndicator', this.$el).remove();
		if (this.specialDate !== undefined) {
			this.$el.append('<div class="specialDayIndicator">'+this.specialDate.getTitle()+'</div>');
			this.$el.addClass('specialDay');
		} else {
			this.$el.removeClass('specialDay');
			
		}

		this.$('.dayIndicator').text(this.day.toString());
		if (this.fitnessClassesForBlock.length === 1) {

			this.$('.classCountIndicator').text('1 Class');

		} else if (this.fitnessClassesForBlock.length > 1) {

			this.$('.classCountIndicator').text(this.fitnessClassesForBlock.length+' Classes');
		} else { //0 classes
			this.$('.classCountIndicator').text('');
			
		}
	},
	hoverOn: function(event) {
		
		//var partialSelector = $(event.delegateTarget).attr('class');
		
		$(event.delegateTarget).not('[empty]').not('.specialDay').animate({backgroundColor: 'rgba(200,200,200,1)'}, 200);
		$(event.delegateTarget).not('[empty]').filter('.specialDay').animate({backgroundColor: 'rgba(255, 166, 109, 1)'}, 200);
	},
	hoverOff: function(event) {
		
		$(event.delegateTarget).not('[empty]').not('.specialDay').animate({backgroundColor: 'rgba(0,0,0,0)'}, 200);
		$(event.delegateTarget).not('[empty]').filter('.specialDay').animate({backgroundColor: '#EECBAD'}, 200);
	},
	showForm: function(event) {
		
		if ($(event.delegateTarget).attr('empty') === undefined) {
			
			var dayOfWeekIndex = parseInt($(event.delegateTarget).parent().attr('id').charAt(11), 10),
                windowTitle = DateHelper.weekDayAsString(dayOfWeekIndex) +', '+DateHelper.monthNameForIndex(parseInt($('#monthIndex').text(),10))+' '+$('.dayIndicator' , event.delegateTarget).text()+' '+$('#yearIndex').text();

			$('#formWindow-title').text(windowTitle);
			$('#dayIndex').text(this.day.toString());
			$('#dayOfWeekIndex').text(dayOfWeekIndex.toString());
			this.fitnessClassesForBlock.forEach(function(fitnessClass) {
				
				//false for no animation
				formWindowView.addClass(fitnessClass, false);
			});
			$('#GFWindowPrimer').fadeIn(400, function() {
				$('#formWindow').show();
			});
		}
		
	}
	
});





//view for the calendar
//has no model but contains the collections and has 
//events that listen to changes in the collection in order to
//render data on the calendar
GFView.MonthView = Backbone.View.extend({

	el: '#calendar',
	//collection that is used by the view
	fitnessClasses: null,
	month: 0,
	year: 0,
	//2D array for blocks in the month view
	//this is an array of rows, and each row 
	//is an array of columns
	dayBlocks: [],

	initialize: function(options) {
		
		this.month = options.month;
		this.year = options.year;
		//this is a collection of backbone models
		//render is called by the reset event on fitness classes
		this.fitnessClasses = options.fitnessClasses;
		//set the reset event for rendering the calendar
		this.fitnessClasses.on('sync', this.render, this);
		specialDates.on('sync', this.render, this);
		specialDates.fetch();
		this.fitnessClasses.fetch();
		
	},
	render: function() {

		var foundFirstDay = false,
		    foundLastDay = false,
		    passedLastDay = false,
            row = 0,
            column = 0,
            iterationDate = new Date(this.year, this.month, 1, 0, 0, 0, 0);
		
		console.log("Rendering calendar");
		//set the display to the month and year indication outside of
		//calendar element
		//month and year index tags are used for holding data that is not 
		//meant to be displayed, but used for rendering other elements
		//and creating models
		$('#month').text(DateHelper.monthNameForIndex(this.month));
		$('#monthIndex').text(this.month);
		$('#year').text(this.year.toString());
		$('#yearIndex').text(this.year.toString());
		//construct date
		//set iterationDate to the first of the month
		
		for (row = 0; row < 6; ++row) {
			
			//initiate the nested array
			if (this.dayBlocks[row] === undefined) {
				this.dayBlocks[row] = new Array(7);
			}
			
			
			for (column = 0; column < 7; ++column) {

				//check for the first day 
				if (!foundFirstDay && iterationDate.getDay() === column) {
					foundFirstDay = true;

				} else if (foundLastDay) {

					passedLastDay = true;
				} else if (!foundLastDay && DateHelper.daysForMonth(iterationDate.getMonth(), this.year) === iterationDate.getDate()) {
					foundLastDay = true;
				}

				if (!foundFirstDay || passedLastDay) {
					
					//create an empty element
					if (this.dayBlocks[row][column] === undefined) {

						this.dayBlocks[row][column] = new GFView.BlockView({row: row, column: column, empty: true});
					} else {

						this.dayBlocks[row][column].reset({row: row, column: column, empty: true});
					}
					

				} else {

					//create a filled column
					//set the number of fitness classes to 0 initially
					if (this.dayBlocks[row][column] === undefined) {
						
						if (specialDates.includesDate(iterationDate)) {
							this.dayBlocks[row][column] = new GFView.BlockView({row: row, column: column, day: iterationDate.getDate(), fitnessClassesForBlock: this.fitnessClasses.getClassesForDay(iterationDate.getDate()), specialDate: specialDates.getSpecialDateForDate(iterationDate)});
					
						} else {
							this.dayBlocks[row][column] = new GFView.BlockView({row: row, column: column, day: iterationDate.getDate(), fitnessClassesForBlock: this.fitnessClasses.getClassesForDay(iterationDate.getDate())});
					
						}
					} else {
						if (specialDates.includesDate(iterationDate)) {
							this.dayBlocks[row][column].reset({row: row, column: column, day: iterationDate.getDate(), fitnessClassesForBlock: this.fitnessClasses.getClassesForDay(iterationDate.getDate()), specialDate: specialDates.getSpecialDateForDate(iterationDate)});
						} else {
							this.dayBlocks[row][column].reset({row: row, column: column, day: iterationDate.getDate(), fitnessClassesForBlock: this.fitnessClasses.getClassesForDay(iterationDate.getDate())});
						}

					}
					
					iterationDate.setDate(iterationDate.getDate() + 1);
					
				}	
			}
		}
		
	},
	incrementMonth: function() {
		this.month += 1;
		if (this.month > 11) {
			this.month = 0;
			this.year += 1;
			
		}
		this.fitnessClasses.incrementMonth();
	
	},
	decrementMonth: function() {
		this.month -= 1;
		if (this.month < 0) {
			this.month = 11;
			this.year -= 1;

		}
		//calls reset and renders new calendar
		this.fitnessClasses.decrementMonth();
	},
	getCalendar: function(month, year) {
		this.month = month;
		this.year = year;
		this.fitnessClasses.getCalendar(month,year);
	}
});

//this backbone view does take a model of a single class
//that it renders to a li
GFView.ClassView = Backbone.View.extend({

	className: 'formWindow-existingClass',
	tagName: 'li',
	
	initialize: function(options) {
		
		this.render(options.animate);


		//dynamically bind events to elements that are dynamically rendered
		$('.formWindow-existingClass-cancel', this.$el).click($.proxy(this.cancel, this));
		if (this.model.isRepeating()) {
			$('.formWindow-existingClass-deleteMultiple', this.$el).click($.proxy(this.deleteMany, this));
			$('.formWindow-existingClass-deleteOne', this.$el).click($.proxy(this.deleteOne, this));
		} else {
			$('.formWindow-existingClass-deleteWhole', this.$el).click($.proxy(this.delete, this));
		}
		
		

	},
	//render the list item with necessary forms for
	//changing options
	render: function(animate) {
		var endDate, monthString, dateString, dayString, month;
		if (animate) {
			this.$el = $('<li class="formWindow-existingClass" style="display: none;"></li>');
			this.$el.insertAfter('#formWindow-newClass');
		} else {
			this.$el = $('<li class="formWindow-existingClass"></li>');
			this.$el.insertAfter('#formWindow-newClass');
		}
		
		if (this.model.getEndDate() === undefined) {
			endDate = 'None';
		} else {
			endDate = this.model.get('endDate');
		}
		this.$el.append('<div class="formWindow-existingClass-className">'+this.model.getClassName()+'</div>');
		this.$el.append('<div class="formWindow-existingClass-instructor">'+this.model.getInstructor()+'</div>');
		this.$el.append('<div class="formWindow-existingClass-times">'+this.model.get('timeRange')+'</div>');
		this.$el.append('<div class="formWindow-existingClass-startDate">Start date: '+this.model.get('startDate')+'</div>');
		this.$el.append('<div class="formWindow-existingClass-endDate">End date: '+endDate+'</div>');
		this.$el.append('<div class="formWindow-existingClass-cancel">Cancel</div>');
		//if the date is repeating, should show more than 1 delete options
		//if the date isn't repeating, then delete simply deletes the 1 instance
		if (this.model.isRepeating()) {
			$('#formWindow-newClass').next().append('<div class="formWindow-existingClass-deleteOptions"><input class="formWindow-existingClass-deleteMultiple" type="button" value="DELETE FUTURE CLASSES" /><input class="formWindow-existingClass-deleteOne" type="button" value="DELETE ONLY THIS" /></div>');
		} else {
			$('#formWindow-newClass').next().append('<div class="formWindow-existingClass-deleteOptions"><input class="formWindow-existingClass-deleteWhole" type="button" value= "DELETE" /></div>');
		}
		//display cancellation if needed
		
		if ($('#dayIndex').text().length === 1) {
			dayString = '0'+$('#dayIndex').text();
		} else {
			dayString = $('#dayIndex').text();
		}

		month = parseInt($('#monthIndex').text(), 10)+1;
		if (month < 10) {
			monthString = '0'+month.toString();
		} else {
			monthString = month.toString();
		}

		dateString = monthString+'/'+dayString+'/'+$('#yearIndex').text();

		if (this.model.isCancelledForDate(dateString)) {
			this.addCancelLayover();
		}
		//dynamically add events to elements that were created

		if (animate) {
			$('#formWindow-newClass').next().slideDown();
		}
		
	},
	cancel: function() {
		var dayString, monthString, month, dateString;
		if ($('#dayIndex').text().length === 1) {
			dayString = '0'+$('#dayIndex').text();
		} else {
			dayString = $('#dayIndex').text();
		}

		
		month = +$('#monthIndex').text() + 1
		if (month < 10) {
			monthString = '0'+month.toString();
		} else {
			monthString = month.toString();
		}

		dateString = monthString+'/'+dayString+'/'+$('#yearIndex').text();

		this.model.addCancelDate(dateString);  
		this.model.save(); 
		this.addCancelLayover();                                                                                                                                                                                                            
	},
	addCancelLayover: function() {

		this.$el.append('<div class="formWindow-existingClass-cancelLayover">Cancelled</div>');
		//bind event to cancel layover
		$('.formWindow-existingClass-cancelLayover', this.$el).click($.proxy(this.uncancel, this));
	},
	uncancel: function() {
		var confirm = new ConfirmationBox({
			message: "Are you sure you want to change this class from cancelled to not cancelled?",
				button1Name: 'YES',
				button2Name: 'NO',
				animate: false,
				deleteAfterPresent: true
		});
		confirm.show(false);
		confirm.on('clicked1', function() {
			var dayString, monthString, month, dateString;
			if ($('#dayIndex').text().length === 1) {
				dayString = '0'+$('#dayIndex').text();
			} else {
				dayString = $('#dayIndex').text();
			}

			
			month = parseInt($('#monthIndex').text(), 10)+1;
			if (month < 10) {
				monthString = '0'+month.toString();
			} else {
				monthString = month.toString();
			}

			dateString = monthString+'/'+dayString+'/'+$('#yearIndex').text();
			$('.formWindow-existingClass-cancelLayover', this.$el).remove();
			this.model.removeCancelledDate(dateString); 
			this.model.save();     
		}, this);
	},
	//for deleting a single instance
	deleteOne: function() {
		var confirm = new ConfirmationBox(
			{
				message: 'Are you sure you would like to delete the group fitness class for this one date?',
				button1Name: 'YES',
				button2Name: 'NO',
				animate: false,
				deleteAfterPresent: true
			}),
            self = this;

		confirm.show(false);
		
		confirm.on('clicked1', function() {
			var currentDate = new Date(parseInt($('#yearIndex').text(), 10), parseInt($('#monthIndex').text(), 10), parseInt($('#dayIndex').text(), 10), 0,0,0,0),
			    newObjData = self.model.slice(currentDate);
			
			if (typeof newObjData === 'object') {
				fitnessClasses.addNewClass(newObjData);
			}
			self.$el.slideUp(400, function() {
				self.remove();
			});
		});
		
	},
	//for deleting many instances
	deleteMany:function() {
		var confirm = new ConfirmationBox(
			{
				message: "Are you sure you would like to delete this and all future group fitness classes?",
				button1Name: 'YES',
				button2Name: 'NO',
				animate: false,
				deleteAfterPresent: true
			}),
                    self = this;
		confirm.show(false);
		confirm.on('clicked1', function() {
			var currentDate = new Date(parseInt($('#yearIndex').text(), 10), parseInt($('#monthIndex').text(), 10), parseInt($('#dayIndex').text(), 10), 0,0,0,0);
			self.model.slice(currentDate);
			self.$el.slideUp(400, function() {
				self.remove();
			});
			//reload the data
			fitnessClasses.fetch();
		});
		confirm.on('clicked2', function() {
			console.log("clicked 2 was called");
			this.off();
		});
		
	},
	delete: function() {
		var confirm = new ConfirmationBox(
			{
				message: "Are you sure you want to delete this group fitness class?",
				button1Name: "YES",
				button2Name: "NO",
				animate: false,
				deleteAfterPresent: true
			}),
		    self = this;
		confirm.show(false);
		confirm.on('clicked1', function() {
			var currentDate = new Date(parseInt($('#yearIndex').text(), 10), parseInt($('#monthIndex').text(), 10), parseInt($('#dayIndex').text(), 10), 0,0,0,0);
			self.model.slice(currentDate);
			self.$el.slideUp(400, function() {
				self.remove();
			});
			//reload the data
			fitnessClasses.fetch();
		});
		
		
	}
	
	

});

//does not have a single model that it renders
//manages the creation and deletion of models
//that are being rendered in the window form
GFView.ClassForm = Backbone.View.extend({

	el: '#formWindow-classes',

	events: {

		'click #formWindow-newClass-title': 'toggleForm',
		'click #formWindow-newClass-submitNewClass': 'submit'
		//need events to manage selections and changes to existing classes
		//event for submission
		//event for changing select elements
	},


	initialize: function() {

		//binding events that are not within the view
		$('#formWindow-exit').click($.proxy(this.exit, this));
		$('#formWindow-exit').mouseenter($.proxy(this.hoverOnExit, this));
		$('#formWindow-exit').mouseleave($.proxy(this.hoverOffExit, this));	

	},
	//adds class that was submitted by the form
	//and appends it immediately after the class creation
	//form, data should be passed from the form
	addClass: function(model, animate) {
		
		var classView = new GFView.ClassView({model: model, animate: animate});
		//slide animation
		this.$('#formWindow-newClass-form').slideUp();
		
	},
	//this toggles the appearance of the new class form
	toggleForm: function() {
		$('#formWindow-newClass-form').slideToggle();
	},
	//returns true if document is ready
	//to be submitted, returns error message
	//if the document is not ready to be submitted
	validateSubmission: function() {
		if ($('#formWindow-newClass-className-input').val() === '') {
			return "You need to enter a name";
		}
 
                if ($('#formWindow-newClass-instructorName-input').val() === '') {
			return "You need to enter an instructor";
		}

		return true;
	},
	//called when the submit button is hit
	submit: function() {
		
		var validation = this.validateSubmission(),

                    dayString, monthString, startDate, monthIndex, yearString, newFitnessClass,
                    data = {};
		if (validation === true) {
			$('#formWindow-newClass-error').hide();
			//submission process

			//construct a data object with the correct fields
			//move this code to the GFClassView object
			
			data.className = $('#formWindow-newClass-className-input').val();
			data.instructor = $('#formWindow-newClass-instructorName-input').val();
			data.dayOfWeek = parseInt($('#dayOfWeekIndex').text(), 10);

			data.startTime = $('#formWindow-newClass-startTime .formWindow-newClass-selectWrapper .formWindow-newClass-hours').children(':selected').text()+':'+
			$('#formWindow-newClass-startTime .formWindow-newClass-selectWrapper .formWindow-newClass-minutes').children(':selected').text()+
			$('#formWindow-newClass-startTime .formWindow-newClass-selectWrapper .formWindow-newClass-ampm').children(':selected').text();

			data.endTime = $('#formWindow-newClass-endTime .formWindow-newClass-selectWrapper .formWindow-newClass-hours').children(':selected').text()+':'+
			$('#formWindow-newClass-endTime .formWindow-newClass-selectWrapper .formWindow-newClass-minutes').children(':selected').text()+
			$('#formWindow-newClass-endTime .formWindow-newClass-selectWrapper .formWindow-newClass-ampm').children(':selected').text();

			//to be removed eventually
			data.timeRange = data.startTime + " - " + data.endTime;
			
			//set specialDate variables
			startDate = new Date(parseInt($('#yearIndex').text(), 10), parseInt($('#monthIndex').text(), 10), parseInt($('#dayIndex').text(), 10));


			//convert month to 1-based for date string
			monthIndex = startDate.getMonth() + 1;
			if (monthIndex < 10) {
				monthString = '0'+ monthIndex.toString();
			} else {
				monthString = monthIndex.toString();
			}

			if ($('#dayIndex').text().length === 1) {
				dayString = '0' + $('#dayIndex').text();
			} else {
				dayString = $('#dayIndex').text();
			}

			yearString = $('#yearIndex').text();
			
			data.startDate = monthString + '/' + dayString + '/' + yearString;
			if ($("input[name='isRepeated']:checked", '#formWindow-newClass-repeatSelections').val() === 'true') {
				data.endDate = '*';
			} else {
				data.endDate = data.startDate;
			}

			//set special date boolean; the remaining setting
			//for inclusion into specialDate is done within the
			//initializer of GFModel.FitnessClass
			if (specialDates.includesDate(startDate)) {
				data.specialDateClass = true;
			} else {
				data.specialDateClass = false;
			}

			newFitnessClass = fitnessClasses.addNewClass(data);
			this.addClass(newFitnessClass, true);
			this.formToDefault();
		} else {
			//present the error message
			$('#formWindow-newClass-error').text(validation);
			$('#formWindow-newClass-error').show();
		}
		
	},
	exit: function() {
		$('#GFWindowPrimer').hide();
		$('#formWindow').hide();
		//hide the form if it was open
		$('#formWindow-newClass-form').hide();
		//remove all exsiting class list items
		$('.formWindow-existingClass').remove();
	},
	hoverOnExit: function() {
		$('#formWindow-exit').animate({backgroundColor: '#cb7c01'}, 200);
	},
	hoverOffExit: function() {
		$('#formWindow-exit').animate({backgroundColor: 'rgba(0,0,0,0)'}, 200);
	},
	//converts the form back to its default values
	//should be called after submission so that values are cleared
	//and buttons are reset
	formToDefault: function() {
		$('#formWindow-newClass-className-input').val('');
		$('#formWindow-newClass-instructorName-input').val('');
		$('#formWindow-newClass-startTime .formWindow-newClass-selectWrapper .formWindow-newClass-hours').val('12');
		$('#formWindow-newClass-startTime .formWindow-newClass-selectWrapper .formWindow-newClass-minutes').val('00');
		$('#formWindow-newClass-startTime .formWindow-newClass-selectWrapper .formWindow-newClass-ampm').val('am');
		$('#formWindow-newClass-endTime .formWindow-newClass-selectWrapper .formWindow-newClass-hours').val('1');
		$('#formWindow-newClass-endTime .formWindow-newClass-selectWrapper .formWindow-newClass-minutes').val('00');
		$('#formWindow-newClass-endTime .formWindow-newClass-selectWrapper .formWindow-newClass-minutes').val('am');

	}
});

var formWindowView = new GFView.ClassForm();


//duplication starts here

//takes a model of a SpecialDate
GFView.SpecialDateView = Backbone.View.extend({

	className: 'specialDayWindow-existingDate',
	tagName: 'li',
	
	initialize: function(options) {
		
		this.render(options.animate);
		//dynamically bind events to elements that are dynamically rendered
		$('.specialDayWindow-existingDate-navigateToDate', this.$el).click($.proxy(this.goToDate, this));
		$('.specialDayWindow-existingDate-delete', this.$el).click($.proxy(this.delete, this));
	},
	//render the list item with necessary forms for
	//changing options
	render: function(animate) {
		
		if (animate) {
			this.$el = $('<li class="specialDayWindow-existingDate" style="display: none;"></li>');
			this.$el.insertAfter('#specialDayWindow-newDate');
		} else {
			this.$el = $('<li class="specialDayWindow-existingDate"></li>');
			this.$el.insertAfter('#specialDayWindow-newDate');
		}

		this.$el.append('<div class="specialDayWindow-existingDate-title">'+this.model.getTitle()+'</div>');
		this.$el.append('<div class="specialDayWindow-existingDate-startDate">Start date: '+this.model.get('startDate')+'</div>');
		this.$el.append('<div class="specialDayWindow-existingDate-endDate">End date: '+this.model.get('endDate')+'</div>');
		
		this.$el.append('<div class="specialDayWindow-existingDate-navigateToDate">Go To Dates</div>');
		this.$el.append('<div class="specialDayWindow-existingDate-delete">Delete</div>');


		if (animate) {
			$('#specialDayWindow-newDate').next().slideDown();
		}
		
	},
	delete: function() { 
		var confirm = new ConfirmationBox(
			{
				message: "Are you sure you want to delete this group fitness class?",
				button1Name: "YES",
				button2Name: "NO",
				animate: false,
				deleteAfterPresent: true
			});
		confirm.show(false);
		
		confirm.on('clicked1', function() {
			//delete method calls destroy on the
			//special date model as well as all
			//fitness classes within the model
			this.model.delete();
			this.$el.slideUp(function() {
				$(this).remove();
			});
			
			specialDates.fetch();
		}, this);
		

		
	},
	goToDate: function() {
		var date = this.model.getStartDate();
		monthView.getCalendar(date.getMonth(), date.getYear() + 1900);
		this.$el.trigger('exit');
	}
	
	

});

//does not have a single model that it renders
//manages the creation and deletion of models
//that are being rendered in the window form
GFView.SpecialDateForm = Backbone.View.extend({

	el: '#specialDayWindow-classes',

	events: {
		//why are events not firing here
	},


	initialize: function() {

		//binding events 
		$('#specialDayWindow-exit').click($.proxy(this.exit, this));
		$('#specialDayWindow-exit').mouseenter($.proxy(this.hoverOnExit, this));
		$('#specialDayWindow-exit').mouseleave($.proxy(this.hoverOffExit, this));
		$('#specialDayWindow-newDate-title').click($.proxy(this.toggleForm, this));
		$('#specialDayWindow-newDate-submitButton').click($.proxy(this.submit, this));
		$('#specialDayWindow-newDate-startDate .specialDayWindow-newDate-monthSelector, #specialDayWindow-newDate-startDate .specialDayWindow-newDate-yearSelector').change($.proxy(this.changeStartSelect, this));
		$('#specialDayWindow-newDate-endDate .specialDayWindow-newDate-monthSelector, #specialDayWindow-newDate-endDate .specialDayWindow-newDate-yearSelector').change($.proxy(this.changeEndSelect, this));	

		this.render();
	},
	render: function() {
		//set up the initial form

		//must also convert month from 1-based to 0-based
		var startMonth = parseInt($('#specialDayWindow-newDate-startDate .specialDayWindow-newDate-monthSelector').val(), 10) - 1,
		    startYear = parseInt($('#specialDayWindow-newDate-startDate .specialDayWindow-newDate-yearSelector').val(), 10),
		    startDays = DateHelper.daysForMonth(startMonth, startYear),
                    endMonth = parseInt($('#specialDayWindow-newDate-endDate .specialDayWindow-newDate-monthSelector').val(), 10) - 1,
		    endYear = parseInt($('#specialDayWindow-newDate-endDate .specialDayWindow-newDate-yearSelector').val(), 10),
		    endDays = DateHelper.daysForMonth(endMonth, endYear),
                    i = 0,
                    currentDay;
		for (i = 0; i < startDays; ++i) {
			if (i < 9) {
				currentDay = '0'+(i+1).toString();
			} else {
				currentDay = (i+1).toString();
			}
			$('#specialDayWindow-newDate-startDate .specialDayWindow-newDate-daySelector').append('<option value='+currentDay+'>'+currentDay+'</option>');
		}

		//must convert month from 1-based to 0-based
		    
		for (i = 0; i < startDays; ++i) {
			
			if (i < 9) {
				currentDay = '0'+(i+1).toString();
			} else {
				currentDay = (i+1).toString();
			}

			$('#specialDayWindow-newDate-endDate .specialDayWindow-newDate-daySelector').append('<option value='+currentDay+'>'+currentDay+'</option>');
		}
	},
	//adds class that was submitted by the form
	//and appends it immediately after the class creation
	//form, data should be passed from the form
	addDates: function(model, animate) {
		
		//this initialzation of new view automatically adds the view to the 
		//list and renders html
		var dateView = new GFView.SpecialDateView({model: model, animate: animate});
		dateView.$el.on('exit', $.proxy(this.exit,this));
		//slide animation for form
		$('#specialDayWindow-newDate-form').slideUp();
		
	},
	//this toggles the appearance of the new class form
	toggleForm: function() {
		$('#specialDayWindow-newDate-form').slideToggle();
	},
	//returns true if document is ready
	//to be submitted, returns error message
	//if the document is not ready to be submitted
	validateSubmission: function() {

		var startDateString, endDateString, startDate, endDate, data, model;
		if ($('#specialDayWindow-newDate-nameInput input').val() === '') {
			return 'Need to include a name for the Special Dates';
		}

		startDateString = 	$('#specialDayWindow-newDate-startDate .specialDayWindow-newDate-monthSelector option:selected').val()+'/'+
							$('#specialDayWindow-newDate-startDate .specialDayWindow-newDate-daySelector option:selected').val()+'/'+
							$('#specialDayWindow-newDate-startDate .specialDayWindow-newDate-yearSelector option:selected').val();

		endDateString = 	$('#specialDayWindow-newDate-endDate .specialDayWindow-newDate-monthSelector option:selected').val()+'/'+
							$('#specialDayWindow-newDate-endDate .specialDayWindow-newDate-daySelector option:selected').val()+'/'+
							$('#specialDayWindow-newDate-endDate .specialDayWindow-newDate-yearSelector option:selected').val();

        startDate = DateHelper.dateFromDateString(startDateString);
		endDate = DateHelper.dateFromDateString(endDateString);
        data = {};
        model;

		if (startDate.getTime() > endDate.getTime()) {
			return 'The end date needs to come after the start date';
		}

		if (specialDates.includesDate(startDate) || specialDates.includesDate(endDate)) {
			return 'Cannot create special date that overlaps with another special date';
		}
		return true;
	
	},
	//called when the submit button is hit
	submit: function() {
		var validate = this.validateSubmission();
		if (validate === true) {
			$('#specialDayWindow-newDate-error').hide();
			data.title = $('#specialDayWindow-newDate-nameInput input').val();

			data.startDate = $('#specialDayWindow-newDate-startDate .specialDayWindow-newDate-monthSelector option:selected').val()+'/'+
							$('#specialDayWindow-newDate-startDate .specialDayWindow-newDate-daySelector option:selected').val()+'/'+
							$('#specialDayWindow-newDate-startDate .specialDayWindow-newDate-yearSelector option:selected').val();
		
			data.endDate = 	$('#specialDayWindow-newDate-endDate .specialDayWindow-newDate-monthSelector option:selected').val()+'/'+
							$('#specialDayWindow-newDate-endDate .specialDayWindow-newDate-daySelector option:selected').val()+'/'+
							$('#specialDayWindow-newDate-endDate .specialDayWindow-newDate-yearSelector option:selected').val();

			model = new GFModel.SpecialDate(data);

			//true for animation
			this.addDates(model, true);
			specialDates.addNewSpecialDate(model);
			this.formToDefault();

		} else {
			$('#specialDayWindow-newDate-error').text(validate);
			$('#specialDayWindow-newDate-error').show();

		}

	},
	exit: function() {
		$('#GFWindowPrimer').hide();
		$('#specialDayWindow').hide();
		//hide the form if it was open
		$('#specialDayWindow-newDate-form').hide();
		//remove all exsiting class list items
		$('.specialDayWindow-existingDate').remove();
	},
	hoverOnExit: function() {
		$('#specialDayWindow-exit').animate({backgroundColor: '#cb7c01'}, 200);
	},
	hoverOffExit: function() {
		$('#specialDayWindow-exit').animate({backgroundColor: 'rgba(0,0,0,0)'}, 200);
	},
	//converts the form back to its default values
	//should be called after submission so that values are cleared
	//and buttons are reset
	formToDefault: function() {
		$('#specialDayWindow-newDate-nameInput input').val('');
		$('#specialDayWindow-newDate-startDate .specialDayWindow-newDate-monthSelector option[value="01"]').attr('selected', 'selected');
		$('#specialDayWindow-newDate-startDate .specialDayWindow-newDate-daySelector option[value="01"]').attr('selected', 'selected');
		$('#specialDayWindow-newDate-startDate .specialDayWindow-newDate-yearSelector option[value="2013"]').attr('selected', 'selected');
		$('#specialDayWindow-newDate-endDate .specialDayWindow-newDate-monthSelector option[value="01"]').attr('selected', 'selected');
		$('#specialDayWindow-newDate-endDate .specialDayWindow-newDate-daySelector option[value="01"]').attr('selected', 'selected');
		$('#specialDayWindow-newDate-endDate .specialDayWindow-newDate-yearSelector option[value=2013]').attr('selected', 'selected');
	},
	//for making modification to the select tags of startDate
	changeStartSelect: function() {

		var month = parseInt($('#specialDayWindow-newDate-startDate .specialDayWindow-newDate-monthSelector').val(), 10) - 1,
			year = parseInt($('#specialDayWindow-newDate-startDate .specialDayWindow-newDate-yearSelector').val(), 10),
			day = parseInt( $('#specialDayWindow-newDate-startDate .specialDayWindow-newDate-daySelector option:selected').val(), 10),
			daysInMonth = DateHelper.daysForMonth(month, year),
			dayAsString, currentDay;
		
		while (day > daysInMonth) {
			day -= 1;
		}

		if (day < 10) {
			dayAsString = '0'+day.toString();
		} else {
			dayAsString = day.toString();
		}


		//remove all options currently within day selector
		$('#specialDayWindow-newDate-startDate .specialDayWindow-newDate-daySelector option').remove();
		for (var i = 0; i < daysInMonth; ++i) {
			
			if (i < 9) {
				currentDay = '0'+(i+1).toString();;
			} else {
				currentDay = (i+1).toString();
			}
			$('#specialDayWindow-newDate-startDate .specialDayWindow-newDate-daySelector').append('<option value='+currentDay+'>'+currentDay+'</option>');
		}
		$('#specialDayWindow-newDate-startDate .specialDayWindow-newDate-daySelector option[value='+dayAsString+']').attr('selected', 'selected');

	},
	//for making modification to the select tags of endDate
	changeEndSelect: function() {

		var month = parseInt($('#specialDayWindow-newDate-endDate .specialDayWindow-newDate-monthSelector').val(), 10) - 1,
			year = parseInt($('#specialDayWindow-newDate-endDate .specialDayWindow-newDate-yearSelector').val(), 10),
			day = parseInt($('#specialDayWindow-newDate-endDate .specialDayWindow-newDate-daySelector').val(), 10),
			daysInMonth = DateHelper.daysForMonth(month, year),
			dayAsString, currentDay, i;


		while (day > daysInMonth) {
			day -= 1;
		}

		
		if (day < 10) {
			dayAsString = '0'+day.toString();
		} else {
			dayAsString = day.toString();
		}
		//remove all options currently within day selector
		$('#specialDayWindow-newDate-endDate .specialDayWindow-newDate-daySelector option').remove();
		for (i = 0; i < daysInMonth; ++i) {
			
			if (i < 9) {
				currentDay = '0'+(i+1).toString();;
			} else {
				currentDay = (i+1).toString();
			}
			$('#specialDayWindow-newDate-endDate .specialDayWindow-newDate-daySelector').append('<option value='+currentDay+'>'+currentDay+'</option>');
		}
		$('#specialDayWindow-newDate-endDate .specialDayWindow-newDate-daySelector option[value='+dayAsString+']').attr('selected', 'selected');

	}
});

var specialDateForm = new GFView.SpecialDateForm();
//set up other events
$('#leftArrow').click(function() {
	monthView.decrementMonth();
});

$('#rightArrow').click(function() {
	monthView.incrementMonth();
});

$('#GFWindowPrimer').click(function() {
	$('#specialDayWindow, #formWindow').hide();
	$(this).hide();
});

$('#specialDaysButton').click(function() {
			
	$('#GFWindowPrimer').fadeIn(400, function() {

		specialDates.each(function(specialDate) {

			this.addDates(specialDate, false);

		}, specialDateForm);
		$('#specialDayWindow').show();
	});
});

