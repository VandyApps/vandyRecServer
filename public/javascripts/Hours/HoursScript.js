(function(global) {

    var hoursCollection = new global.HoursModel.HoursCollection();

    var model1 = new HoursModel.Hours(
        {
            name: 'Summer Hours', 
            priorityNumber: 0, 
            startDate: '05/02/2013',
            endDate: '08/17/2013',
            facilityHours: true,
            closedHours: false,
            times: 
            [
                {startTime: '08:30am', endTime: '12:00pm'},
                {startTime: '04:30am', endTime: '12:00pm'},
                {startTime: '12:00am', endTime: '09:45pm'},
                {startTime: '06:00am', endTime: '06:00pm'}
            ]
        });

    var model2 = new HoursModel.Hours(
        {
            name: 'Spring Hours', 
            priorityNumber: 0, 
            startDate: '01/08/2013',
            endDate: '05/02/2013',
            facilityHours: true,
            closedHours: false,
            times: 
            [
                {startTime: '08:30am', endTime: '12:00pm'},
                {startTime: '04:30am', endTime: '12:00pm'},
                {startTime: '12:00am', endTime: '09:45pm'},
                {startTime: '06:00am', endTime: '06:00pm'}
            ]
        });

    var model3 = new HoursModel.Hours(
        {
            name: 'Winter Hours', 
            priorityNumber: 0, 
            startDate: '12/14/2013',
            endDate: '01/08/2014',
            facilityHours: true,
            closedHours: false,
            times: 
            [
                {startTime: '08:30am', endTime: '12:00pm'},
                {startTime: '04:30am', endTime: '12:00pm'},
                {startTime: '12:00am', endTime: '09:45pm'},
                {startTime: '06:00am', endTime: '06:00pm'}
            ]
        });
    //global.hoursCollection.add(model1);

    var hoursItem1 = new global.HoursView.HoursItem({model: model1});
    var hoursItem2 = new global.HoursView.HoursItem({model: model2});
    var hoursItem3 = new global.HoursView.HoursItem({model: model3});
    var hoursTableView = new global.HoursView.HoursTable();
    hoursTableView.add(hoursItem1);
    hoursTableView.add(hoursItem2);
    hoursTableView.add(hoursItem3);

})(this);