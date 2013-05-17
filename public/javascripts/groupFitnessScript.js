//animate color changes of the blocks

$('.dayBlock').mouseover(function() {

	$(this).animate({backgroundColor: 'rgba(200, 200, 200, 1)'};
});

$('.dayBlock').mouseout(function() {

	$(this).animate({backgroundColor: 'rgba(0, 0, 0, 0)'});
});
