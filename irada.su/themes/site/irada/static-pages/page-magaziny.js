$(document).ready(function () {

	// По клику на название города рядом с картой перемещаемся к списку магазинов в нём
	$('.city-links').on('click', 'a', function () {
		$(document).scrollTo(
			$('.page-static h4[data-tag="' + $(this).attr('data-scroll-target') + '"]'),
			1000,
			{axis: 'y'}
		);
	});
});