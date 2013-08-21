

//setup the MonthView instance
var currentDate = new Date(),
	fitnessClasses = new GFModel.FitnessClasses({month: currentDate.getMonth(), year: currentDate.getYear() + 1900}),
	monthView = new GFView.MonthView({month: currentDate.getMonth(), year: currentDate.getYear() + 1900, fitnessClasses: fitnessClasses});
