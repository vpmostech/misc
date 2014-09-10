$(document).ready(function () {
	$('.box.fabrics .body').on('click', '.fabric', function () {
		var info = $(this).find('span:hidden').html(),
			$infoDiv = $('.fabric-info');

		if ($infoDiv.is(':hidden')) {
			$infoDiv.html(info).toggle('blind', {direction: 'up'});
		} else {
			$infoDiv.fadeOut(function () {
				$(this).html(info).fadeIn();
			});
		}
	});
});