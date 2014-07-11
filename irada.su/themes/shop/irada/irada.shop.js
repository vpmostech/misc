$(document).ready(function () { 
	
	// Количество товаров на странице
	$('ul.goods-per-page li a').on('click', function (event) {
		$.cookie('products_per_page', $(this).html(), { expires: 30, path: '/'});	
	});
	
	// Раскрывающиеся фильтры
	$('[class^="filter-"]').accordion({
		header: 'h4',
		heightStyle: "content",
		collapsible: true,
	});

	// При добавлении в корзину количество товаров отображать спинбоксом
	$('#cart-form input[name="quantity"]').spinner({
		min: 1,
	});
	// То же самое в самой корзине, с пробросом события родному input'у 
	$('input.qty').spinner({
		min: 1,
		spin: function (event, ui) {
			$(this).val(ui.value).change();
		},
	});

	// Галерея изображений товара (эта жесть взята из default)
    $("#product-gallery .thumb-image a").on('click', function (event) {
        $('.product-gallery .image').removeClass('selected');
        $(this).parent().addClass('selected');

        $("#product-image").addClass('blurred');
        $("#switching-image").show();
        
        var img = $(this).find('img');
        var size = $("#product-image").attr('src').replace(/^.*\/[0-9]+\.(.*)\..*$/, '$1');
        var src = img.attr('src').replace(/^(.*\/[0-9]+\.)(.*)(\..*)$/, '$1' + size + '$3');
        $('<img>').attr('src', src).load(function () {
            $("#product-image").attr('src', src);
            $("#product-image").removeClass('blurred');
            $("#switching-image").hide();
        }).each(function() {
            //ensure image load is fired. Fixes opera loading bug
            if (this.complete) { $(this).trigger("load"); }
        });
        //var size = $("#product-image").parent().attr('href').replace(/^.*\/[0-9]+\.(.*)\..*$/, '$1');
		// Перепилено (добавлен parent()) для совместимости с magnific popup ИЛИ лупой, так как он создаёт свои элементы
		var size = $("#product-image").parent().parent().attr('href').replace(/^.*\/[0-9]+\.(.*)\..*$/, '$1');
		var href = img.attr('src').replace(/^(.*\/[0-9]+\.)(.*)(\..*)$/, '$1' + size + '$3');

        $("#product-image").parent().attr('href', href);
        return false;
    });

	// Быстрый просмотр товаров
	$('ul.product-list li').on('mouseover', function (event) {
		$('.product-quickview-link').hide();
		w = $(this).find('img:visible').width();
		$(this).children('.product-quickview-link').width(w).show();
	});
	$('.product-quickview').on('mouseleave', function (event) {
		//$(this).parent().hide();
	});
	$('.image-left, .image-right').on('click', function (event) {
		event.preventDefault();
		var $this = $(this);
		var $spanimgs = $this.siblings('.image_paths').children('span');
		if ($spanimgs.length > 1) {
			var $img = $this.parent().parent().parent().find('div.image img');
			$curSpan = $spanimgs.filter('[data-url="' + $img.attr('src') + '"]');
			if ($this.hasClass('image-right')) {
				var newsrc = ($curSpan.next('span').length ? $curSpan.next('span') : $spanimgs.first()).attr('data-url');
			} else {
				var newsrc = ($curSpan.prev('span').length ? $curSpan.prev('span') : $spanimgs.last()).attr('data-url');
			}
			
			$img.attr('src', newsrc);
			// Это всякая красота с затемнением изображения на время загрузки, но она глючит,
			// ибо затемняется на мгновение каждый раз. Можно городить флаги загруженности, но лень.
			/*
			$img.addClass('blur');
			$img.attr('src', newsrc).one('load', function (event) {
				//$(this).removeClass('blur');
			});
			if ($img.get(0).complete) {
				$(this).trigger("load"); // Опере без этого непонятно
			}
			*/
		}
	});
		
});


// Лупа на основном изображении товара
$(document).ready(function () {
	
	$imageMain = $('.image-main');
	w = $imageMain.children('img').width();
	h = $imageMain.children('img').height();
	$imageMain.jqzoom({
		zoomWidth: w ? w : 300,
		zoomHeight: h ? h : 300,
		xOffset: 40,
		preloadText: 'Загрузка изображения...',	
		title: false,
	});
});

// Всё, что связано, с выбором размера товара
$(document).ready(function () {

	// Выбор размера в карточке товара
	$('.size-var').on('click', function (event) {
		$this = $(this);
		$('.size-var').removeClass('size-var-active');
		$this.addClass('size-var-active');
		hideHint();
		$('#sizeparam').val($this.attr('data-value'));
	});

	// Чтобы нельзя было добавить в корзину размерный товар, не указав размер
	$('#add-to-cart').on('click', function (event) {
		if ($('.size-var-active').length != 1) {
			showHint();
			return false;
		}
	});

	function showHint()
	{
		$hint = $('.form-fill-hint');
		if ($hint.filter(':hidden').length) {
			$hint.show('clip', {}, 1000);
		} else {
			$hint.effect('highlight', {color: '#dfbed7'}, 1000);
		}
	}

	function hideHint()
	{
		$('.form-fill-hint').hide('clip', {}, 1000);
	}
	
});

// Галерея при клике на изображение товара
// Посчитали, что боковых эскизов вполне достаточно
/*
$(document).ready(function () {

	var hrefs = [];

	// Подготовим изображения для галереи
	$('#product-gallery .thumb-image a').each(function () {
		hrefs.push({src: this.href });
	});

	$("#product-core-image a").magnificPopup({
		items: hrefs,
		type: 'image',
		gallery: {
		  enabled: true
		},

		zoom: {
			//enabled: true,
			duration: 300, // duration of the effect, in milliseconds
			easing: 'ease-in-out', // CSS transition easing function 
			opener: function(openerElement) {
				return $('#product-image');
			}
		},

		callbacks: {
			open: function () {
				// Чтобы галерея открывалась на нужном изображении
				var num = 0;
				$('#product-gallery .thumb-image').each(function(index) {
					if ($(this).hasClass('selected')) {
						num = index;
						return false;
					}
				});
				this.goTo(num);
			},
		},
	});
});
*/

// Таблица размеров
$(document).ready(function () {
	
	$('.show-sizetable').magnificPopup({
		type: 'inline',
	});

});

// Чтобы в корзине по клику на позицию (в любое место строки) происходил переход в карточку товара
// TODO