//animate color changes of the blocks
$('.dayBlock:not([empty])').mouseover(function() {
	$(this).animate( { backgroundColor: 'rgba(200, 200, 200, 1)' } );
	
});

$('.dayBlock:not([empty])').mouseout(function() {
	
	$(this).animate( { backgroundColor: 'rgba(0, 0, 0, 0)' } );
	
});
