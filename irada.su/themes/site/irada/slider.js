$(document).ready(function () {

	var nSlides = $('.slider .slide').length;
	var sliderInterval = null;

	$('.slider .nav_right').on('click', function (event) {
		clearInterval(sliderInterval);
		nextSlide();
	});

	$('.slider .nav_left').on('click', function (event) {
		clearInterval(sliderInterval);
		prevSlide();
	});

	$('.slider .page').on('click', function (event) {
		clearInterval(sliderInterval);
		showSlide($(this).attr('rel'));
	});

	function getActiveSlideNum()
	{
		var cur = -1;
		$('.slider .slide').each(function (index) { 
			if ($(this).hasClass('active')) {
				cur = index;
			}
		});
		return cur;
	}

	function nextSlide()
	{
		if (nSlides <= 1) {
			return;
		}
		cur = getActiveSlideNum();
		showSlide(cur < (nSlides - 1) ? cur + 1 : 0);
	}

	function prevSlide()
	{
		if (nSlides <= 1) {
			return;
		}
		cur = getActiveSlideNum();
		showSlide(cur != 0 ? cur - 1 : nSlides - 1);
	}

	function showSlide(num)
	{
		$slides = $('.slider .slide');
		$slides.filter('.active').fadeOut(800, function () {
			$(this).removeClass('active');
			$slides.eq(num).fadeIn(1600).addClass('active');
			$('.slider .page').removeClass('active').filter('[rel="' + num + '"]').addClass('active');
		});
	}

	$(window).on('load', function () {
		sliderInterval = setInterval(nextSlide, 5000);
	});

});