$(document).ready(function () {
	ymaps.ready(function () {	
		var shopCoords = JSON.parse($('h1[data-shop-coords]').attr('data-shop-coords'));

		var myMap = new ymaps.Map('yamap-shop', {
			center: shopCoords,
			zoom: 16,
			controls: ['zoomControl'],
		});

		myMap.geoObjects.add(new ymaps.Placemark(shopCoords, {}));

	});
});