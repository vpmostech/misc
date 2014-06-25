ymaps.ready(function () {

	myMap = new ymaps.Map('yamap', {
        center: [55.73811857813739, 37.61699737548825], // Москва
        zoom: 11,
		controls: [],
    });

	//myMap.behaviors.disable(['drag', 'rightMouseButtonMagnifier', 'scrollZoom', 'dblClickZoom', 'multiTouch']);
	//myMap.behaviors.enable();

	// Перечислим магазины
	var shops = {};
	shops['Moscow_Nautilus'] = {
		coordX: 55.759182,
		coordY: 37.624605,
		name: 'Concept store IRADA',
		addr: 'Москва, ул. Никольская, д. 25,<br />ТЦ "Наутилус", 3 этаж',
		closestMetro: 'Лубянка',
		operationTime: ['11:00', '22:00'],
		tel: '+7 915 254 1557',
	}
	shops['Moscow_Raduga'] = {
		coordX: 55.738184,
		coordY: 37.666141,
		name: 'IRADA',
		addr: 'Москва, ул.Таганская, д. 40,<br />ТЦ "Радуга", 1 пав-н',
		closestMetro: 'Марксистская',
		operationTime: ['10:00', '20:30'],
		tel: '+7 915 308 0112',
	}
	shops['Moscow_ShowRoom'] = {
		coordX: 55.69348,
		coordY: 37.592808,
		name: 'Шоу-рум IRADA',
		addr: 'Москва, ул. Шверника, д. 17, корп. 3',
		closestMetro: 'Академическая',
		operationDays: ['пн', 'пт'],
		operationTime: ['10:00', '19:00'],
		tel: '+7 968 968 9355',
	}
	shops['Kazan'] = {
		coordX: 55.783044,
		coordY: 49.113666,
		name: 'IRADA',
		addr: 'Казань, ул. Парижской коммуны, д. 10/72,<br />ТЦ "На Московской"',
		operationTime: ['10:00', '19:00'],
		tel: '+7 927 488 9834',
	}
	shops['Ulyanovsk'] = {
		coordX: 54.385554,
		coordY: 48.583737,
		name: 'IRADA',
		addr: 'Ульяновск, пр-кт Авиастроителей, д. 7а,<br />ТЦ "Парус", 1 этаж',
		operationTime: ['10:00', '20:00'],
		tel: '+7 929 797 9715',
	}
	shops['Tumen'] = {
		coordX: 57.147286,
		coordY: 65.543747,
		name: 'IRADA',
		addr: 'Тюмень, ул.Герцена, д.97,<br />ТЦ "Центральный", пав-н 316',
		tel: '+7 922 483 8533',
	}
	shops['Nabereg'] = {
		coordX: 55.70061,
		coordY: 52.317689,
		name: 'IRADA',
		addr: 'Набережные Челны, мкр. ГЭС, ул.Центральная д.79/1,<br />ТЦ "Йорт", 1 этаж',
		tel: '+7 927 450 0007',
	}	
	// Поместим магазины на карту
	for (var shopNick in shops) {
		var shop = shops[shopNick];
		var bcHeader = shop.name;
		var bcBody = shop.addr;
		if (shop.closestMetro) {
			bcBody += '<br /> м. ' + shop.closestMetro;
		}
		var bcFooter = '';
		if (shop.operationDays) {
			bcFooter += ' ' + shop.operationDays[0] + '-' + shop.operationDays[1];
		}
		if (shop.operationTime) {
			bcFooter += ' ' + shop.operationTime[0] + '-' + shop.operationTime[1];
		}
		if (bcFooter.length > 0) {
			bcFooter = 'Время работы: ' + bcFooter;
		}
		if (shop.tel) {
			bcFooter += (bcFooter.length > 0 ? ',<br />' : '') + 'телефон ' + shop.tel;
		}
		var bcHint = shop.name;
		myMap.geoObjects.add(new ymaps.Placemark([shop.coordX, shop.coordY], {
			balloonContentHeader: bcHeader,
			balloonContentBody: bcBody,
			balloonContentFooter: bcFooter,
			hintContent: bcHint
		}));
	}

	// Выбор города
	cityPos = {
		'Moscow': {
			center: [55.73811857813739, 37.61699737548825],
			zoom: 11
		},
	};
	$('#mapCity').on('change', function (event) {
		myMap.balloon.close();
		city = $(this).val();
		if (shops[city]) {
			myMap.setCenter([shops[city].coordX, shops[city].coordY], 15);
		} else {
			myMap.setCenter(cityPos[city].center, cityPos[city].zoom);
		}	
	});

	// Если сюда пришли по ссылке конкретного магазина - переключимся сразу на него
	var getVars = window.location.search.substring(1).split("&");
	for(var i = 0; i < getVars.length; i++) { 
		var getVar = getVars[i].split("=");
		if (getVar[0] == 'city' && typeof(getVar[1]) != "undefined") {
			$('#mapCity').val(getVar).change();
			break;
		}
   }

});