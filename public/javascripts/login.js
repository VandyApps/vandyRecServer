$('#loginForm').submit(function() {
	if ($('.loginTextInput[name="username"]').attr('value') === '') {
		$('#warning').text('You need to include a username');
		return false;
	} else if ($('.loginTextInput[name="password"]').attr('value') === '') {
		$('#warning').text('You need to include a password');
		return false;
	}  else {
		return true;
	}
});