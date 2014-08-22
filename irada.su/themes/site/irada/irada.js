$(document).ready(function () {

	// Выключим по-умолчанию некоторые формы (до нажатия определённой кнопки)	
	$('form.disabled-by-default input, form.disabled-by-default select').prop('disabled', true);
	// Включатель форм
	$('.makeeditable').on('click', function (event) {
		event.preventDefault();
		$('#' + $(this).attr('rel') + ' input').prop('disabled', false);
		$('#' + $(this).attr('rel') + ' select').prop('disabled', false);
	});

	// Ссылки "Добавить в избранное"
	$('a.favourite').on('click', function () {
		var title = window.document.title, // можно на что-то заменить
			url = window.document.location;

		if (window.sidebar && window.sidebar.addPanel) {
			// Gecko до v23
			window.sidebar.addPanel(title, url, "");
		} else if (typeof(opera)=="object" || window.sidebar && !window.sidebar.addPanel) {
			// Opera или новый firefox
			this.url = url;
			this.title = title;
			//this.rel = 'sidebar';
			return true;
		} else if (window.external && window.external.AddFavorite) {
			// IE
			window.external.AddFavorite(url, title);
		}
		return false;
	});

});