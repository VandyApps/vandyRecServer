var HoursView = {};

HoursView.HoursItem = Backbone.View.extend({
    model: HoursModel.Hours,
    tagName: 'li',

    initialize: function(options) {
        this.render();
    },
    render: function() {
        this.$el.append('<div class="hoursItem-name">'+this.model.getName()+'</div>');
        this.$el.append('<div class="hoursItem-startDate">'+this.model.get('startDate')+'</div>');
        this.$el.append('<div class="hoursItem-endDate">'+this.model.get('endDate')+'</div>');
    },
    showWindow: function() {
        //window not yet implemented
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
    }
    //adds an HoursItem view to the end of the list and renders the item
    push: function(hoursItem) {
        this.views.push(hoursItem);
        this.$el.append(hoursItem.$el);
    },
    //this method adds a view to the correct slot within the list
    //if the list is not sorted before this method is
    //called, the list is sorted before adding the new element
    add: function(hoursItem) {
        if (this.isSorted()) {
            var itemAdded = false;
            for (var i = 0; i < this.views; ++i) {
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
    },
    //checks if the list is sorted
    isSorted: function() {
        for (var i = 1; i < this.views.length; ++i) {
            if (this.views[i].getSortValue() < this.views[i-1].getSortValue()) {
                return false;
            }
        }
        return true;
    }

});