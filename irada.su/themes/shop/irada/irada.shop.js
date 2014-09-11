$(document).ready(function () { 
	'use strict';
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
        
        var img = $(this).find('img'),
			size = $("#product-image").attr('src').replace(/^.*\/[0-9]+\.(.*)\..*$/, '$1'),
			src = img.attr('src').replace(/^(.*\/[0-9]+\.)(.*)(\..*)$/, '$1' + size + '$3');
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
		var size = $("#product-image").parent().parent().attr('href').replace(/^.*\/[0-9]+\.(.*)\..*$/, '$1'),
			href = img.attr('src').replace(/^(.*\/[0-9]+\.)(.*)(\..*)$/, '$1' + size + '$3');

		// Добавлен parent() (аналогично size выше)
        $("#product-image").parent().parent('a').attr('href', href);

		// Тут некий хак лупы (jqzoom).
		// Если использовать её галереей, для смены изображений она использует свою функцию swapimage
		// объекта, хранящегося в поле .data('jqzoom') того, на что мы налепили лупу при создании.
		// На вход она получает тот же свой объект, у которого в 'rel' ссылки на новое изображение.
		// Будем вызывать эту функцию, подкладывая ей нужный объект.
		$('.image-main')
			.attr('rel', JSON.stringify({smallimage: $("#product-image").attr('src'), largeimage: $(this).attr('href')})) // Записали подставной rel
			.data('jqzoom').swapimage('.image-main'); // Вызвали функцию

        return false;
    });

	// Галерея изображений (слайдер)
	$('#product-gallery')
		.on('click', '.thumbs-up, .thumbs-down', function (event) {
			var dir = $(this).hasClass('thumbs-up') ? '-' : '+';
			$(event.delegateTarget).children('.gallery-window')
				.scrollTo(dir + '=100px', 1000);
		})
		.children('.gallery-window').scrollTop(0);

	// Быстрый просмотр товаров
	$('ul.product-list li').on('mouseover', function (event) {
		$('.product-quickview-link').hide();
		var w = $(this).find('img:visible').width();
		$(this).children('.product-quickview-link').width(w).show();
	});
	$('.product-quickview').on('mouseleave', function (event) {
		$(this).parent().hide();
	});
	$('.image-left, .image-right').on('click', function (event) {
		event.preventDefault();
		var $this = $(this),
			$spanimgs = $this.siblings('.image_paths').children('span');
		if ($spanimgs.length > 1) {
			var $img = $this.parent().parent().parent().find('div.image img'),
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

	// Табы в карточке товара
	$('#product-tabs').tabs({
		show: true
	});

	// Новый отзыв
	$('#addReview').on('click', function (event) {
		if ($(this).attr('href') != '#') {
			return true;
		}
		event.preventDefault();
		var $previewForm = $('#product-review-form');
		$previewForm.toggle('blind', {direction: 'up'});
		return false;
	});

	// Задать вопрос
	$('form#product_question').on('submit', function () {
		var $this = $(this);
		$this.find('input').each(function () {	
			$(this).toggleClass('error', $(this).val() === '');
		});
		if ($this.find('input.error').length) {
			return false;
		}

		$this.append('<span class="loading"><i class="icon16 loading"></i></span>');
		$.post($this.attr('action'), $this.serialize(), function (response) {
			var text = (response === "1") ? 'Спасибо! Мы свяжемся с Вами.' : 'Произошла ошибка.';
			$this.replaceWith('<div>' + text + '</div>');
		})
		.fail(function () {
			$this.replaceWith('<div>' + 'Произошла ошибка.' + '</div>');
		});

		return false;
	});

		
});

// Лупа на основном изображении товара
$(document).ready(function () {
	
	var $imageMain = $('.image-main');
	$imageMain.find('#product-image').on('load', function () {
		var w = $(this).width(),
			h = $(this).height();
			dh = 40; // const
		$imageMain.jqzoom({
			zoomWidth: w ? w : 300,
			zoomHeight: (h ? h : 300) - dh,
			xOffset: 0,
			yOffset: dh,
			preloadText: 'Загрузка изображения...',	
			title: false,
		});
	});
});

// Всё, что связано, с выбором размера товара
$(document).ready(function () {

	// Выбор размера в карточке товара
	$('.size-var').on('click', function (event) {
		var $this = $(this);
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
		var $hint = $('.form-fill-hint');
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

