
var HoursView = {};

HoursView.HoursItem = Backbone.View.extend({
    model: HoursModel.Hours,
    tagName: 'li',

    events: {
        'click': 'test'
    },
    test: function() {
        console.log("The element was clicked");
    },
    initialize: function() {
        this.render();

    },
    render: function() {
        this.$el.append('<div class="hoursItem-name">'+this.model.getName()+'</div>')
                .append('<div class="hoursItem-startDate">'+this.model.get('startDate')+'</div>')
                .append('<div class="hoursItem-endDate">'+this.model.get('endDate')+'</div>');
    },
    showWindow: function() {
        //window not yet implemented
        console.log("Show the window here");
    },
    //sort value that is used to determine 
    //the ordering of the elements in the list
    getSortValue: function() {
        return this.model.getStartDate();
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
        this.render();
    },
    render: function() {
        //set the element to be the hours list at
        //index corresponding to the type number
        this.$el = $('.hoursList:eq('+this.type+')');

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
            return view2.getSortValue() - view1.getSortValue();
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
        console.log("Add was called");
        var itemAdded = false, i;
        if (this.views.length !== 0) {

            if (this.isSorted()) {
                for (i = 0; i < this.views && !itemAdded; ++i) {
                    if (hoursItem.getSortValue() < this.views[i].getSortValue()) {
                        itemAdded = true;
                        this.views.slice(i, 0, hoursItem);
                    }
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
    initialize: function() {
        this.render();
    },
    render: function() {
        console.log("Rendering the window here");
    },
    //appends new hours to the time object
    appendHoursToView: function(weekDay, timeObject) {
        var firstPortion = $("<li class='hoursWindow-listItem' id='hoursWindow-times-"+weekDay+"'></li>")
                .appendTo('#hoursWindow-times', this.$el)
                //append these div tags to the element that 
                //was just created
                .append("<div class='hoursWindow-listItem-edit'>edit</div>")
                .append("<div class='hoursWindow-listItem-title'>"+DateHelper.weekDayAsString(weekDay)+"</div>");

        $("<div class='hoursWindow-listItem-timeRange'></div>").appendTo(firstPortion)
            .append("<span class='hoursWindow-listItem-startTime'>"+timeObject.startTime+"</span>")
            .append("<span>-</span>")
            .append("<span class='hoursWindow-listItem-endTime'>"+timeObject.endTime+"</span>");

        $("<div class='hoursWindow-listItem-sameAsAbove'>Same As Above</div>").appendTo(firstPortion);
        
    },
    delete: function() {
         console.log("Delete element and remove hours window");
    },
    //this method makes changes to the model and to 
    //the view
    setHours: function(weekDay, timeObject) {
        this.model.setTimesForDay(weekDay, timeObject);
        var listElement = $('#hoursWindow-times-'+weekDay);
        if (listElement.length === 1) {
            //element exists
            console.log("element exists");
        } else {
            //element does not exist, must create the entire
            // element and insert it into the correct slot of the list
            console.log("Element does not exist");
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
    edit: function() {
        //show window and bind events to check when to remove window
        console.log("Editing the time range for a single element in the hours of operation list");
    }
});