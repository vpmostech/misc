function addToFavourites(a)
{
	var title = window.document.title; // можно на что-то заменить
	var url = window.document.location;

	if (window.sidebar && window.sidebar.addPanel) {
		// Gecko до v23
		window.sidebar.addPanel(title, url, "");
	} else if (typeof(opera)=="object" || window.sidebar && !window.sidebar.addPanel) {
		// Opera или новый firefox
		a.url = url;
		a.title = title;
		//a.rel = 'sidebar';
		return true;
	} else if (window.external && window.external.AddFavorite) {
		// IE
		window.external.AddFavorite(url, title);
	}
	return false;
}

function swapBG()
{
	if ( typeof swapBG.flag == 'undefined' ) {
        swapBG.flag = 2;
    } else {
		swapBG.flag = (swapBG.flag == 2) ? 1 : 2;
	}
	img = 'http://' + document.location.host + '/wa-data/public/site/themes/irada/graphics/Fon-';
	jQuery('body').css('background-image', 'url(' + img + swapBG.flag + '.jpg)');
}


// Выключим по-умолчанию некоторые формы (до нажатия определённой кнопки)
$(document).ready(function () { 
	
	$('form.disabled-by-default input, form.disabled-by-default select').prop('disabled', true);

	// Включатель форм
	$('.makeeditable').on('click', function (event) {
		event.preventDefault();
		$('#' + $(this).attr('rel') + ' input').prop('disabled', false);
		$('#' + $(this).attr('rel') + ' select').prop('disabled', false);
	});

});