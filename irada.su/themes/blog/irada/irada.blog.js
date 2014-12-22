$(document).ready(function () {

	$('.post-thumb').each(function () {
		var $this = $(this);
		var $img = $this.find('.post-short img:not(.date-icon), .post-text img').first();
		if ($img.length) {
			$img.appendTo($this.find('.post-img'));
		}
		
	});

});
