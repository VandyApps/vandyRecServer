//animate color changes of the blocks
console.log("called script");
$('.dayBlock').mouseover(function() {
	console.log("Called mouseover");
	$(this).animate( { backgroundColor: 'rgba(200, 200, 200, 1)' } );
	console.log("Animated");
});

$('.dayBlock').mouseout(function() {
	console.log("called mouseout");
	$(this).animate( { backgroundColor: 'rgba(0, 0, 0, 0)' } );
	console.log("animated");
});
