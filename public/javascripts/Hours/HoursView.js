var HoursView = {};

HoursView.HoursItem = Backbone.View.extend({
    model: HoursModel.Hours,
    tagName: 'li',

    initialize: function() {
        this.render();
    },
    render: function() {
        this.$el.append('<div class="hoursItem-name">'+this.model.getName()+'</div>');
        this.$el.append('<div class="hoursItem-startDate">'+this.get('startDate')+'</div>');
        this.$el.append('<div class="hoursItem-endDate">'+this.get('endDate')+'</div>');
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
        this.type = (options.type === undefined) ? 0 : options.type;
        this.views = (options.views === undefined) ? [] : options.views;
        this.render();
    },
    render: function() {
        //set the element to be the hours list at
        //index corresponding to the type number
        this.$el = $('.hoursList').toArray()[this.type];
    },
    getName: function() {
        //get the title within the text of the 
        //section header above the table element
        return this.$el.prev().text();
    },
    sort: function() {
        //remove all elements inside the table view
        //this method is reloading the table view
        this.$el.children().remove();

        //sort the elements based on their sort values 
        //elements are in ascending sortValue order
        this.views.sort(function(view1, view2) {
            return view2.getSortValue() - view1.getSortValue();
        });

        //rerender all the elements within the view
    },
    push: function(hoursItem) {

    },
    add: function(hoursItem) {
        
    }

});