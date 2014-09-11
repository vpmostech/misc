$(document).ready(function () {

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

	// Локализация календаря
	$.datepicker.regional['ru'] = {
		closeText: 'Закрыть',
		prevText: '&#x3c;Пред',
		nextText: 'След&#x3e;',
		currentText: 'Сегодня',
		monthNames: ['Январь','Февраль','Март','Апрель','Май','Июнь',
			'Июль','Август','Сентябрь','Октябрь','Ноябрь','Декабрь'],
		monthNamesShort: ['Янв','Фев','Мар','Апр','Май','Июн',
			'Июл','Авг','Сен','Окт','Ноя','Дек'],
		dayNames: ['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'],
		dayNamesShort: ['вск','пнд','втр','срд','чтв','птн','сбт'],
		dayNamesMin: ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'],
		dateFormat: 'dd.mm.yy',
		firstDay: 1,
		isRTL: false
	};
	$.datepicker.setDefaults($.datepicker.regional['ru']); 

	// Календарь для выбора даты рождения в профиле пользователя.
	// Чтобы использовать стандартные параметры пользователя WebAsyst,
	// будем прятать его поля, создавать своё поле с $.datepicker и
	// связывать его со спрятанными.
	var $bdField = $('form#userprofile .wa-field.wa-field-birthday');
	if ($bdField.length) {
		var bdDay = $bdField.find('[name="profile[birthday][value][day]"]').val(),
			bdMonth = $bdField.find('[name="profile[birthday][value][month]"]').val(),
			bdYear = $bdField.find('[name="profile[birthday][value][year]"]').val();
		
		// Создаём наше поле
		var $fakeBirthdayField = 
			$('<input type="text" name="bd" />')
			.datepicker()
			.on('change', function () {
				var d = $(this).datepicker('getDate');
				$bdField
					.find('[name="profile[birthday][value][day]"]')
						.val(d.getDate())
						.end()
					.find('[name="profile[birthday][value][month]"]')
						.val(d.getMonth() + 1)
						.end()
					.find('[name="profile[birthday][value][year]"]')
						.val(d.getFullYear())
						.end();

			});
		
		// Заполняем его данными из стандартных полей
		if (bdDay && bdMonth && bdYear) {
			$fakeBirthdayField.datepicker('setDate', new Date(bdYear, bdMonth - 1, bdDay))
		}
		
		// Спрячем стандартные поля и вставим наше
		$bdField.find('select, input').hide();
		$bdField.find('.wa-value').append($fakeBirthdayField);

		// Иконка календаря
		var $calendarIcon = $('<div/>').addClass('calendarIcon')
			.on('click', function () {
				$fakeBirthdayField.datepicker('show');
			});
		$fakeBirthdayField.after($calendarIcon);
	}

});