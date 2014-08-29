$(document).ready(function () {
	'use strict';

    // Полноразмерные фотографии во всплывающем окне.
	// Для начала соберём контент для окна (по частям):
	// Избображение
	var img = $('<div/>').addClass('image-container')
		.append($('<div/>').addClass('mfp-img'));
	// Область под изображением
	var bottomBar = $('<div/>').addClass('mfp-bottom-bar')
		.append($('<div/>').addClass('mfp-counter'))
		.append($('<div/>').addClass('date').html('Добавлена <span class="val"></span>'))
		.append($('<div/>').addClass('albumname').html('Альбом <span class="val"></span>'));
	// Иконки навигации по галерее
	var nav = $('<div/>').addClass('nav-left').add($('<div/>').addClass('nav-right'));
	// Соберём воедино
	var markup = $('<div/>').addClass('mfp-figure')
		.append(img)
		.append(nav)
		.append(bottomBar)
		.append($('<div/>').addClass('mfp-close'));
	// Подключаем
	$('.gallery-photo > a').magnificPopup({
		type: 'image',
		closeOnContentClick: false,
		image: {
			verticalFit: true,
			markup: markup
		},
		tClose: 'Закрыть (ESC)',
		gallery: {
			enabled: true,
			tCounter: '<span class="">Фотография<br />%curr% / %total%</span>',
			arrowMarkup: ''
		},
		callbacks: {
			change: function () {
				var $el = this.currItem.el,
					uploaddate = new Date($el.data('uploaddate').split(' ', 1)[0]),
					albumname = $el.data('albumname') ? "&laquo;" + $el.data('albumname') + "&raquo;" : "";
				this.content
					.find('.mfp-bottom-bar .date > .val')
						.text(uploaddate.toLocaleDateString())
						.end()
					.find('.mfp-bottom-bar .albumname > .val')
						.html(albumname);
			}
		}
	});

	// Навигация
	$('body').on('click', '.mfp-figure .nav-left', function (event) {
		$.magnificPopup.instance.prev();
		return false;
	});
	$('body').on('click', '.mfp-figure .nav-right', function (event) {
		$.magnificPopup.instance.next();
		return false;
	});

});
