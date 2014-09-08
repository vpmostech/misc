$(document).ready(function () {

	$('.post-thumb').each(function () {
		var $this = $(this);
		$img = $(this).find('.post-text img').first().appendTo($this.find('.post-img'));
	});

});
