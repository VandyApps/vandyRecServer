(function(global) {

    var hoursCollection = new global.HoursModel.HoursCollection();

    var model1 = new HoursModel.Hours(
        {
            name: 'Brendans Hours', 
            priorityNumber: 0, 
            startDate: '05/02/2013',
            endDate: '08/17/2013',
            times: 
            [
                {startTime: '08:30am', endTime: '12:00pm'},
                {startTime: '04:30am', endTime: '12:00pm'},
                {startTime: '12:00am', endTime: '09:45pm'},
                {startTime: '06:00am', endTime: '06:00pm'}
            ]
        });
    //global.hoursCollection.add(model1);

    var hoursItem = new global.HoursView.HoursItem({model: model1});
    var hoursTableView = new global.HoursView.HoursTable();
    hoursTableView.add(hoursItem);

})(this);