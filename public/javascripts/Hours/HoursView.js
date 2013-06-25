
var HoursView = {};

HoursView.HoursItem = Backbone.View.extend({
    model: HoursModel.Hours,
    tagName: 'li',

    events: {
        'click': 'showWindow'
    },
    initialize: function() {
        this.render();
        //add events
        this.model.on('change:startDate', function() {console.log("Change the order of the table");});
        this.model.on('change:endDate', function() {console.log('Change the display of end date');});

    },
    render: function() {
        this.$el.append('<div class="hoursItem-name">'+this.model.getName()+'</div>')
                .append('<div class="hoursItem-startDate">'+this.model.get('startDate')+'</div>')
                .append('<div class="hoursItem-endDate">'+this.model.get('endDate')+'</div>');
    },
    showWindow: function() {
        //window not yet implemented
        hoursWindowView.show().displayModel(this.model);
    },
    //sort value that is used to determine 
    //the ordering of the elements in the list
    getSortValue: function() {
        return this.model.getStartDate().getTime();
    }
});

HoursView.HoursTable = Backbone.View.extend({
    //number that maps to a type for the Table
    //0 = BaseHours
    //1 = Other Hours
    //2 = Closed Hours
    //3 = Other Hours
    type: 0,
    //an array of HoursItem views within the table
    views: [],
    initialize: function(options) {
        this.type = (!options || options.type === undefined) ? 0 : options.type;
        this.views = (! options || options.views === undefined) ? [] : options.views;

        if (!this.isSorted()) {
            this.sort();
        }

        this.render();
    },
    render: function() {
        //set the element to be the hours list at
        //index corresponding to the type number
        this.$el = $('.hoursList:eq('+this.type+')');

        //remove any children that might be in the view already
        this.$el.children().remove();

        //add elements from the views
        this.views.forEach(function(view) {
            this.$el.append(view.$el);
        }, this);
    },
    getName: function() {
        //get the title within the text of the 
        //section header above the table element
        return this.$el.prev().text();
    },
    //the sort method sorts the array of views
    //but does not render the new sorted order
    sort: function() {
        //sort the elements based on their sort values 
        //elements are in ascending sortValue order
        this.views.sort(function(view1, view2) {
            return view1.getSortValue() - view2.getSortValue();
        });
    },
    //reloads the views within the views array
    //to display in the order they are in the array
    reload: function() {
        //remove all elements inside the table view
        //this method is reloading the table view
        this.$el.children().remove();

        //rerender all the elements within the view
        this.views.forEach(function(view) {
            this.$el.append(view.$el);
        }, this);
    },
    //adds an HoursItem view to the end of the list and renders the item
    push: function(hoursItem) {
        this.views.push(hoursItem);
        this.$el.append(hoursItem.$el);
    },
    //this method adds a view to the correct slot within the list
    //if the list is not sorted before this method is
    //called, the list is sorted before adding the new element
    add: function(hoursItem) {
        var itemAdded = false, i, n;
        if (this.views.length !== 0) {
            if (this.isSorted()) {
                for (i = 0, n = this.views.length; i < n && !itemAdded; ++i) {
                    
                    if (hoursItem.getSortValue() < this.views[i].getSortValue()) {
                        
                        itemAdded = true;
                        this.views = this.views.slice(0, i).concat([hoursItem]).concat(this.views.slice(i, n - i));
                        this.$el.children().eq(i).before(hoursItem.$el);

                    }
                }
                if (!itemAdded) {
                    //then append the element because it goes
                    //after all existing elemements
                    this.views.push(hoursItem);
                    this.$el.append(hoursItem.$el);
                }

            } else {
                
                this.views.push(hoursItem);
                this.sort();
                this.reload();
            }
        } else {
            this.views.push(hoursItem);
            this.$el.append(hoursItem.$el);
        }
      
    },
    //checks if the list is sorted
    isSorted: function() {
        var i = 1;
        if (this.views.length === 0 || this.views.length === 1) {
            return true;
        }

        for (i = 1; i < this.views.length; ++i) {
            if (this.views[i].getSortValue() < this.views[i-1].getSortValue()) {
                return false;
            }
        }
        return true;
    }

});

HoursView.HoursWindow = Backbone.View.extend({

    el: '#hoursWindow',
    isEditting: false,
    events: {
        'click #hoursWindow-exit': 'hide',
        'mouseenter #hoursWindow-exit': 'hoverOnExit',
        'mouseleave #hoursWindow-exit': 'hoverOffExit',
        'click #hoursWindow-editDates': 'editDates'
    },
    
    render: function() {
        
        var times = this.model.get('times'),
            i, n;

        console.log("Dont forget to fill in the table section in the category at the top right corner");
        $('#hoursWindow-title').text(this.model.getName());
        //clear all the existing elements within the hours of operation
        $('#hoursWindow-times', this.$el).children().remove();

        $('#hoursWindow-hoursStartDate', this.$el).text(this.model.get('startDate'));
        $('#hoursWindow-hoursEndDate', this.$el).text(this.model.get('endDate'));
        
        //append the times from the model to the view
        this.model.iterateTimes(function(obj, index) {

            this.appendHoursToView(index, obj);

        }, this);

        
        $('#hoursWindow-priorityNumber').hide();

        //render the view differently for baseHours
        //and non-baseHours
        if (this.model.isBaseHours()) {
            $('#hoursWindow-priorityNumberSelect').hide();
            $('#hoursWindow-priorityNumberBase').show();
            $('#hoursWindow-delete').hide();
            $('#hoursWindow-editDates').hide();
        } else {

            $('#hoursWindow-priorityNumberSelect').show();
            $('#hoursWindow-priorityNumberBase').hide();
            $('#hoursWindow-priorityNumber').val(this.model.getPriorityNumber().toString());
            $('#hoursWindow-delete').show();
            $('#hoursWindow-editDates').show();
        }
    },
    //appends new hours to the time object
    appendHoursToView: function(weekDay, timeObject) {
        var hours = $("<li class='hoursWindow-listItem' id='hoursWindow-times-"+weekDay+"'></li>")
                .appendTo('#hoursWindow-times', this.$el)
                //append these div tags to the element that 
                //was just created
                .append("<div class='hoursWindow-listItem-edit'>edit</div>")
                .append("<div class='hoursWindow-listItem-title'>"+DateHelper.weekDayAsString(weekDay)+"</div>");

        $("<div class='hoursWindow-listItem-timeRange'></div>").appendTo(hours)
            .append("<span class='hoursWindow-listItem-startTime'>"+timeObject.startTime+"</span>")
            .append("<span>-</span>")
            .append("<span class='hoursWindow-listItem-endTime'>"+timeObject.endTime+"</span>");

        $("<div class='hoursWindow-listItem-sameAsAbove'>Same As Above</div>").appendTo(hours);

        //bind events to the element

        //edit events
        $('.hoursWindow-listItem-edit', hours).click($.proxy(this.editTimes, this));
        //same as above events
        $('.hoursWindow-listItem-sameAsAbove', hours).click($.proxy(this.sameAsAbove, this));
    },
    delete: function() {
         console.log("Delete element and remove hours window");
    },
    //for rendering new models
    displayModel: function(model) {


        this.model = model;
        this.render();

        this.model.on('change', function() {
            console.log("change in the start date event");
        });
        this.model.on('change:endDate', function() {
            console.log("Change in the end date event");
        });  

        return this;
    },
    //this method makes changes to the model and to 
    //the view
    setHours: function(weekDay, timeObject) {
        this.model.setTimesForDay(weekDay, timeObject);
        var listElement = $('#hoursWindow-times-'+weekDay),
            startTimeEl, endTimeEl,
            foundPredecessor, predecessorIndex;

        if (listElement.length === 1) {
            //element exists
            startTimeEl = listElement.find('.hoursWindow-listItem-startTime');
            endTimeEl = listElement.find('.hoursWindow-listItem-endTime');

            startTimeEl.text(timeObject.startTime);
            endTimeEl.text(timeObject.endTime);
        } else {
            //the model should be responsible for creating the correct weekdays
            //necessary for the hours
            console.log("The element does not exist yet.  Might have this throw an error");
             
        }
    },
    //get the week day of the list item at the given index in
    //the unordered list
    getDayForItemAtIndex: function(index) {
        var length = $('#hoursWindow-times').children().length,
            element = (index < length) ? $('#hoursWindow-times').children().eq(index) : null,
            elementID = (element) ? element.attr('id') : null;
            if (elementID) {
                return +(elementID.substr(elementID.length - 1, 1));
            }
            throw new Error("Searching for list item in hours of operation list using out of range index");
    },
    editTimes: function(event) {
        //show window and bind events to check when to remove window
        var startTimeEl = $(event.delegateTarget).parent().find('.hoursWindow-listItem-startTime'),
            endTimeEl = $(event.delegateTarget).parent().find('.hoursWindow-listItem-endTime'),
            startTime = startTimeEl.text(),
            endTime = endTimeEl.text();

        hoursEditView.reset({editDates: false, startTime: startTime, endTime: endTime});
        hoursEditView.show();
        hoursEditView.on('doneEdit', function() {
        
            this.setHours($(event.delegateTarget).parent().index(),
                {
                    startTime: hoursEditView.startTime, 
                    endTime: hoursEditView.endTime
                });

            //unbind all the events
            hoursEditView.unbind('doneEdit');
            hoursEditView.unbind('cancelEdit');
        }.bind(this));

        hoursEditView.on('cancelEdit', function() {

            //unbind all the events
            hoursEditView.unbind('doneEdit');
            hoursEditView.unbind('cancelEdit');
        });
    },
    editDates: function() {
        console.log("edit dates");
        hoursEditView.reset(
            {
                editDates: true, 
                startDate: this.model.get('startDate'), 
                endDate: this.model.get('endDate')
            });

        hoursEditView.show();

        hoursEditView.on('doneEdit', function() {
            console.log("done editting dates");
            console.log("start: " + hoursEditView.startDate + " end: " + hoursEditView.endDate);
            this.model.set('startDate', hoursEditView.startDate);
            this.model.set('endDate', hoursEditView.endDate);
            
            hoursEditView.unbind('doneEdit');
            hoursEditView.unbind('cancelEdit');

        }.bind(this));

        hoursEditView.on('cancelEdit', function() {
            console.log("Cancel editting dates");
            hoursEditView.unbind('doneEdit');
            hoursEditView.unbind('cancelEdit');

        }.bind(this));

    },
    //NOT DOCUMENTED
    //this method does not do anything if the element is the 
    //first element in the list
    sameAsAbove: function(event) {
        var currentEl = $(event.delegateTarget).parent(),
            currentID = currentEl.attr('id'),
            currentDay = +(currentID.substr(currentID.length - 1, 1)),
            previousEl = currentEl.prev(),
            previousID, previousDay;

            if (previousEl.length === 1) {
                previousID = previousEl.attr('id');
                previousDay = +(previousID.substr(previousID.length - 1, 1));

                this.setHours(currentDay, this.model.getTimeObjectForDay(previousDay));
            }

    },
    show: function(animate) {
        if (animate) {
            $('#hoursWindowPrimer').css({'z-index': 100}).fadeIn(400, function() {
                this.$el.show();
            }.bind(this));
        } else {
            $('#hoursWindowPrimer').css({'z-index': 100}).show();
            this.$el.show();
        }
        return this;
        
    },
    hide: function() {
         
        $('#hoursWindowPrimer').hide();
        this.$el.hide(); 
        return this;
    },
    hoverOnExit: function() {
        $('#hoursWindow-exit').animate({backgroundColor: '#c97b01'}, 400);
    },
    hoverOffExit: function() {
        $('#hoursWindow-exit').animate({backgroundColor: 'rgba(0,0,0,0)'}, 400);
    }

    
});


var hoursEditView = (function() {

    HoursView.HoursEdit = Backbone.View.extend({
        editDates: false,
        startDate: '01/01/2013',
        endDate: '01/02/2013',
        startTime: '12:00am',
        endTime: '08:00pm',

        render: function() {
            var startSelect, endSelect,
                startArray, endArray,
                i, daysInMonth, daysEl;
            //set the correct $el
            this.$el = (this.editDates) ? $('#hoursEdit-editDates') : $('#hoursEdit-editTimes');
            startSelect = $('.hoursEdit-startSelect', this.$el);
            endSelect = $('.hoursEdit-endSelect', this.$el);
            console.log("Element is set to: " + this.$el.attr('id'));
            if (this.editDates) {
                

                startArray = DateHelper.splitDate(this.startDate);
                endArray = DateHelper.splitDate(this.endDate);

                //set the options for the day select tags
                $('.hoursEdit-startSelect select:nth-child(2), .hoursEdit-endSelect select:nth-child(2)', this.$el).children().remove();

                //create start date elements
                daysEl = $('.hoursEdit-startSelect select:nth-child(2)');
                daysInMonth = DateHelper.daysForMonth(+startArray[0] - 1, +startArray[2]);
                for (i = 1; i <= daysInMonth; ++i) {
                    
                    if (i < 10) {
                        daysEl.append('<option value="0'+i+'">'+i+'</option>');
                    } else {
                        daysEl.append('<option value="'+i+'">'+i+'</option>');
                    }  
                }

                //create end date elements
                daysEl = $('.hoursEdit-endSelect select:nth-child(2)');
                daysInMonth = DateHelper.daysForMonth(+endArray[0] - 1, +endArray[2]);
                for (i = 1; i <= daysInMonth; ++i) {
                    
                    if (i < 10) {
                        daysEl.append('<option value="0'+i+'">'+i+'</option>');
                    } else {
                        daysEl.append('<option value="'+i+'">'+i+'</option>');
                    }  
                }

            } else {
                startArray = DateHelper.splitTime(this.startTime);
                endArray = DateHelper.splitTime(this.endTime);
            }

            


            for (i = 0; i < 3; ++i) {
                startSelect.children().eq(i).val(startArray[i]);
                endSelect.children().eq(i).val(endArray[i]);
            }
        },
        //setting up that requires render to have been
        //called.  This includes binding events to dynamically
        //bound $el
        //NOT DOCUMENTED
        bindEvents: function() {
            $('.hoursEdit-done input[value="done"]', this.$el).click($.proxy(this.didEdit, this));
            $('.hoursEdit-done input[value="cancel"]', this.$el).click($.proxy(this.didCancel, this));

            //bind change event
            if (this.editDates) {
                //change the start and end date properties
                //every time the select elements change
                $('.hoursEdit-startSelect select:nth-child(2)', this.$el).change(function() {
                    this.startDate =    $('.hoursEdit-startSelect select:nth-child(1)', this.$el).val() + '/' +
                                        $('.hoursEdit-startSelect select:nth-child(2)', this.$el).val() +  '/' +
                                        $('.hoursEdit-startSelect select:nth-child(3)', this.$el).val();


                }.bind(this));

                 $('.hoursEdit-endSelect select:nth-child(2)', this.$el).change(function() {
                    this.endDate =  $('.hoursEdit-endSelect select:nth-child(1)', this.$el).val() + '/' +
                                    $('.hoursEdit-endSelect select:nth-child(2)', this.$el).val() + '/' +
                                    $('.hoursEdit-endSelect select:nth-child(3)', this.$el).val();

                }.bind(this));

                 //also bind events for generating the correct number of days when the month
                 //or year changes
                 $('.hoursEdit-endSelect select:nth-child(1), .hoursEdit-endSelect select:nth-child(3), .hoursEdit-startSelect select:nth-child(1), .hoursEdit-startSelect select:nth-child(3)', this.$el)
                    .change(function(event) {

                        var monthStr = $(event.delegateTarget).parent().children(':nth-child(1)').val(),
                            yearStr = $(event.delegateTarget).parent().children(':nth-child(3)').val(),
                            daysEl = $(event.delegateTarget).parent().children(':nth-child(2)'),
                            dayStr = daysEl.val(),
                            days = DateHelper.daysForMonth(+monthStr - 1, +yearStr),
                            newDay = +dayStr, 
                            i;

                        //if the old day is greater than the
                        //total number of days in the month,
                        //then set the new day value to the last
                        //day of the month
                        while (newDay > days) {
                            newDay--;
                        }
                        //reset the dayStr to the newDay value
                        //that has just been set
                        dayStr = (newDay < 10) ? '0' + newDay.toString() : newDay.toString();

                        daysEl.children().remove();

                        for (i = 1; i <= days; ++i) {
                            if (i < 10) {
                                daysEl.append('<option value="0'+i+'">'+i+'</option>');
                            } else {
                                daysEl.append('<option value="'+i+'">'+i+'</option>');
                            }  
                        }
                        daysEl.val(dayStr);

                        this.startDate= $('.hoursEdit-startSelect select:nth-child(1)', this.$el).val() + '/' +
                                        $('.hoursEdit-startSelect select:nth-child(2)', this.$el).val() +  '/' +
                                        $('.hoursEdit-startSelect select:nth-child(3)', this.$el).val();


                        this.endDate =  $('.hoursEdit-endSelect select:nth-child(1)', this.$el).val() + '/' +
                                        $('.hoursEdit-endSelect select:nth-child(2)', this.$el).val() + '/' +
                                        $('.hoursEdit-endSelect select:nth-child(3)', this.$el).val();
                        console.log("Setting new start: " + this.startDate + " and end: " + this.endDate);
                        console.log("Element: " + this.$el.attr('id'));
                     }.bind(this));



            } else {
                //change the start and end time properties
                //every time the select elements change
                $('.hoursEdit-startSelect select', this.$el).change(function() {

                    this.startTime =    $('.hoursEdit-startSelect select:nth-child(1)', this.$el).val() + ':' +
                                        $('.hoursEdit-startSelect select:nth-child(2)', this.$el).val() + 
                                        $('.hoursEdit-startSelect select:nth-child(3)', this.$el).val();

                }.bind(this));

                $('.hoursEdit-endSelect select', this.$el).change(function() {

                     this.endTime =     $('.hoursEdit-endSelect select:nth-child(1)', this.$el).val() + ':' +
                                        $('.hoursEdit-endSelect select:nth-child(2)', this.$el).val() + 
                                        $('.hoursEdit-endSelect select:nth-child(3)', this.$el).val();

                }.bind(this));
            }
        },
        reset: function(options) {
            this.editDates = options.editDates;
            if (this.editDates) {
                this.startDate = options.startDate;
                this.endDate = options.endDate;
            } else {
                this.startTime = options.startTime;
                this.endTime = options.endTime;

            }
            this.render();
        },
        didEdit: function() {
            
            this.hide();
            this.trigger('doneEdit');
            
        },
        didCancel: function() {
            
            this.hide();
            this.trigger('cancelEdit');
            
        },
        show: function() {
            this.$el.show();
            this.bindEvents();
        },
        hide: function() {
            this.$el.hide();
            $('.hoursEdit-done input[value="done"]', this.$el).unbind('click');
            $('.hoursEdit-done input[value="cancel"]', this.$el).unbind('click');
        },
        //for changing the number of days available
        // when a month or year is selected
        //NOT DOCUMENTED
        addDateChangeEvents: function() {

        }
    });
    
    return new HoursView.HoursEdit();

})();



//global variables related to the view
//are defined here
var hoursWindowView = new HoursView.HoursWindow();