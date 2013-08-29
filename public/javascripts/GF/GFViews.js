var GFView = {};

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
		var endDate, monthString, dateString, dayString, month,
			calendar = Calendar.getInstance();

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
		
		if (calendar.getSelectedDay() < 10) {
			dayString = '0'+ calendar.getSelectedDay().toString();
		} else {
			dayString = calendar.getSelectedDay().toString();
		}

		month = calendar.getMonth()+1;
		if (month < 10) {
			monthString = '0'+month.toString();
		} else {
			monthString = month.toString();
		}

		dateString = monthString+'/'+dayString+'/'+calendar.getYear().toString();

		if (this.model.isCancelledForDate(dateString)) {
			this.addCancelLayover();
		}
		//dynamically add events to elements that were created

		if (animate) {
			$('#formWindow-newClass').next().slideDown();
		}
		
	},
	cancel: function() {
		var dayString, monthString, month, dateString,
			calendar = Calendar.getInstance();
		if (calendar.getSelectedDay() < 10) {
			dayString = '0'+ calendar.getSelectedDay().toString();
		} else {
			dayString = calendar.getSelectedDay().toString();
		}

		
		month = calendar.getMonth() + 1
		if (month < 10) {
			monthString = '0'+month.toString();
		} else {
			monthString = month.toString();
		}

		dateString = monthString+'/'+dayString+'/'+ calendar.getYear().toString();

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
		var calendar,

			confirm = new ConfirmationBox({
				message: "Are you sure you want to change this class from cancelled to not cancelled?",
					button1Name: 'YES',
					button2Name: 'NO',
					animate: false,
					deleteAfterPresent: true
			});

		confirm.show(false);
		confirm.on('clicked1', function() {

			calendar = Calendar.getInstance();
			var dayString, monthString, month, dateString;
			if (calendar.getSelectedDay() < 10) {
				dayString = '0'+calendar.getSelectedDay().toString();
			} else {
				dayString = calendar.getSelectedDay().toString();
			}

			
			month = calendar.getMonth()+1;
			if (month < 10) {
				monthString = '0'+month.toString();
			} else {
				monthString = month.toString();
			}

			dateString = monthString+'/'+dayString+'/'+ calendar.getYear().toString();
			$('.formWindow-existingClass-cancelLayover', this.$el).remove();
			this.model.removeCancelledDate(dateString); 
			this.model.save();     
		}, this);
	},
	//for deleting a single instance
	deleteOne: function() {
		var calendar,
			confirm = new ConfirmationBox(
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
			var calendar = Calendar.getInstance(),
				currentDate = calendar.getSelectedDate(),
			    newObjData = self.model.slice(currentDate),
			    fitnessClasses = GFModel.FitnessClasses.getInstance();


			if (typeof newObjData === 'object') {
				fitnessClasses.addNewClass(newObjData);
			}
			self.$el.slideUp(400, function() {
				self.remove();
			});

			confirm.unbind('clicked1');
			confirm.unbind('clicked2');
		});

		confirm.on('clicked2', function() {
			confirm.unbind('clicked1');
			confirm.unbind('clicked2');
		});
		
	},
	//for deleting many instances
	deleteMany:function() {
		var calendar,
			confirm = new ConfirmationBox(
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
			var currentDate,
				fitnessClasses = GFModel.FitnessClasses.getInstance();

			calendar = Calendar.getInstance();
			currentDate = calendar.getSelectedDate();
				

			self.model.slice(currentDate);
			self.$el.slideUp(400, function() {
				self.remove();
			});
			//reload the data
			fitnessClasses.fetch();
			confirm.unbind('clicked1');
			confirm.unbind('clicked2');
		});
		confirm.on('clicked2', function() {
			console.log("clicked 2 was called");
			confirm.unbind('clicked1');
			confirm.unbind('clicked2');
		});
		
	},
	delete: function() {
		var calendar,
			confirm = new ConfirmationBox(
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

			var fitnessClasses = GFModel.FitnessClasses.getInstance(),
				currentDate;
				calendar = Calendar.getInstance();
				currentDate = calendar.getSelectedDate();
			
			self.model.slice(currentDate);
			self.$el.slideUp(400, function() {
				self.remove();
			});
			//reload the data
			fitnessClasses.fetch();
		});		
	}

});

//does not have a single model that it renders.
//This manages the creation and deletion of models
//that are being rendered in the window form

GFView.ClassForm = (function() {
	var Instance = Backbone.View.extend({

		el: '#formWindow',
		//fitness classes that are being displayed
		//in the form, this object is of type
		//GFView.ClassView
		classes: [],
		events: {

			'click #formWindow-newClass-title': 'toggleForm',
			'click #formWindow-newClass-submitNewClass': 'submit',
			'click #formWindow-exit': 'exit',
			'mouseenter #formWindow-exit': 'hoverOnExit',
			'mouseleave #formWindow-exit': 'hoverOffExit'
			//need events to manage selections and changes to existing classes
			//event for submission
			//event for changing select elements
		},


		initialize: function() {
			//bind calendar event
			Calendar.getInstance().on('calBlockClicked', this.show.bind(this));
			
		},
		//sets the title of the form
		setTitle: function(year, month, day) {
			var date = new Date(year, month, day),
				monthName = DateHelper.monthNameForIndex(month),
				weekDay = DateHelper.weekDayAsString(date.getDay());

			this.$('#formWindow-title').text(weekDay + ", " + monthName + " " + day.toString() + " " + year.toString());
		},
		//displays the form and loads the data from the calendar into
		//the form
		show: function(event) {
			var calendar = Calendar.getInstance(),
				month = calendar.getMonth(),
				year = calendar.getYear(),
				//the day that is being clicked is passed through the 
				//event, but it is also updated in the calendar,
				//however, no gaurantee that the selected day is updated
				//in the calendar before this method is called
				day = event.day,
				classes = calendar.getClassesForDay(day);

			this.setTitle(year, month, day);
			classes.forEach(function(fitnessClass) {
				this.addClass(fitnessClass, {animate: false});
			}, this);

			$('#GFWindowPrimer').show(0, function() {
				$('#formWindow').show();
			});
			
		},
		//removes all classes in the view
		reset: function() {
			//remove the classes array
			this.classes = [];
			//remove all existing classes within the list
			$('.formWindow-existingClass').remove();

		},
 		//adds class that was submitted by the form
		//and appends it immediately after the class creation
		//form, data should be passed from the form
		addClass: function(model, options) {
			var animate = !options || options.animate,
				classView = new GFView.ClassView({model: model, animate: animate});
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

			if ($('#formWindow-newClass-location-input').val() === '') {
	 			return "You need to include a location";
	 		}

			return true;
		},
		//called when the submit button is hit
		submit: function() {
			
			//validation is either true or an error message
			var validation = this.validateSubmission(),
				calendar = Calendar.getInstance(),

                dayString, monthString, startDate, monthIndex, yearString, newFitnessClass,
                data = {},
                specialDates = GFModel.SpecialDates.getInstance();

			if (validation === true) {
				$('#formWindow-newClass-error').hide();
				//submission process

				//construct a data object with the correct fields
				//move this code to the GFClassView object
				
				data.className = $('#formWindow-newClass-className-input').val();
				data.instructor = $('#formWindow-newClass-instructorName-input').val();
				data.location = $('#formWindow-newClass-location-input').val();
				data.dayOfWeek = calendar.getSelectedWeekDay();

				data.startTime = $('#formWindow-newClass-startTime .formWindow-newClass-selectWrapper .formWindow-newClass-hours').children(':selected').text()+':'+
				$('#formWindow-newClass-startTime .formWindow-newClass-selectWrapper .formWindow-newClass-minutes').children(':selected').text()+
				$('#formWindow-newClass-startTime .formWindow-newClass-selectWrapper .formWindow-newClass-ampm').children(':selected').text();

				data.endTime = $('#formWindow-newClass-endTime .formWindow-newClass-selectWrapper .formWindow-newClass-hours').children(':selected').text()+':'+
				$('#formWindow-newClass-endTime .formWindow-newClass-selectWrapper .formWindow-newClass-minutes').children(':selected').text()+
				$('#formWindow-newClass-endTime .formWindow-newClass-selectWrapper .formWindow-newClass-ampm').children(':selected').text();

				//to be removed eventually
				data.timeRange = data.startTime + " - " + data.endTime;
				
				//set specialDate variables
				startDate = new Date(calendar.getYear(), calendar.getMonth(), calendar.getSelectedDay());


				//convert month to 1-based for date string
				monthIndex = startDate.getMonth() + 1;
				if (monthIndex < 10) {
					monthString = '0'+ monthIndex.toString();
				} else {
					monthString = monthIndex.toString();
				}

				if (calendar.getSelectedDay() < 10) {
					dayString = '0' + calendar.getSelectedDay().toString();
				} else {
					dayString = calendar.getSelectedDay().toString();
				}

				yearString = calendar.getYear();
				
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

				newFitnessClass = GFModel.FitnessClasses.getInstance().addNewClass(data);
				this.addClass(newFitnessClass, true);
				this.formToDefault();
			} else {
				//validation is an error message, not a boolean
				//present the error message
				$('#formWindow-newClass-error').text(validation);
				$('#formWindow-newClass-error').show();
			}
			
		},
		exit: function() {
			var calendar = Calendar.getInstance();

			//deal with elements

			$('#GFWindowPrimer').hide();
			$('#formWindow').hide();
			//hide the form if it was open
			$('#formWindow-newClass-form').hide();
			//remove all exsiting class list items
			$('.formWindow-existingClass').remove();

			//notify the calendar that the calendar 
			//block is no longer on call
			calendar.blockHandled();
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
		

	return {
		getInstance: function() {
			if (!GFView.ClassForm.instance) {
				GFView.ClassForm.instance = new Instance();
			}
			return GFView.ClassForm.instance;
		},
		initialize: function() {
			GFView.ClassForm.instance = new Instance();
		}
	};
})();



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
			}),
			specialDates = GFModel.SpecialDates.getInstance();
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
		Calendar.getInstance().getCalendar(date.getMonth(), date.getYear() + 1900);
		this.$el.trigger('exit');
	}
	
	

});

//does not have a single model that it renders
//manages the creation and deletion of models
//that are being rendered in the window form
GFView.SpecialDateForm = (function() {

	var Instance = GFView.SpecialDateForm = Backbone.View.extend({

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

			var startDateString, endDateString, startDate, endDate, data = {},
				specialDates = GFModel.SpecialDates.getInstance();
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
			var validate = this.validateSubmission(), data = {}, model;
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
				//only rerender calendar if the new special dates
				//would appear in this month

				GFModel.SpecialDates.getInstance().addNewSpecialDate(model);
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

	return {
		getInstance: function() {
			if (!GFView.SpecialDateForm.instance) {
				GFView.SpecialDateForm.instance = new Instance();
			}
			return GFView.SpecialDateForm.instance;
		}
	};
})();
	
//set up other events
$('#leftArrow').click(function() {
	Calendar.getInstance().decrementMonth();
});

$('#rightArrow').click(function() {
	Calendar.getInstance().incrementMonth();
});

$('#GFWindowPrimer').click(function() {
	$('#specialDayWindow, #formWindow').hide();
	$(this).hide();
});

$('#specialDaysButton').click(function() {
			
	$('#GFWindowPrimer').show(0, function() {

		GFModel.SpecialDates.getInstance().each(function(specialDate) {

			this.addDates(specialDate, false);

		}, GFView.SpecialDateForm.getInstance());
		$('#specialDayWindow').show();
	});
});

