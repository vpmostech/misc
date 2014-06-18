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
        var size = $("#product-image").parent().attr('href').replace(/^.*\/[0-9]+\.(.*)\..*$/, '$1');
        var href = img.attr('src').replace(/^(.*\/[0-9]+\.)(.*)(\..*)$/, '$1' + size + '$3');
        $("#product-image").parent().attr('href', href);
        return false;
    });

	// Быстрый просмотр товаров
	$('ul.product-list li').on('mouseover', function (event) {
		$('.product-quickview-link').hide();
		$(this).children('.product-quickview-link').show();
	});
	$('.product-quickview').on('mouseleave', function (event) {
		$(this).parent().hide();
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
				$(this).trigger("load");
			}
			*/
		}
	});

	// Чтобы в корзине по клику на позицию (в любое место строки) происходил переход в карточку товара

});