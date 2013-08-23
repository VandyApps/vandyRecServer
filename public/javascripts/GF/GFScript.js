

//setup the MonthView instance
var currentDate = new Date(),
	monthView = new GFView.MonthView({month: currentDate.getMonth(), year: currentDate.getYear() + 1900, fitnessClasses: GFModel.FitnessClasses.getInstance()});
