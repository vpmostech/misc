$(function () {
	'use strict';

    function updateCart(data)
    {
		// Shop-script упорно добавляет денежную единицу и пробел в число,
		// из-за этого приходится мудрить.
		var total = parseInt(data.total.replace(new RegExp(' ','g'), '')),
			discount = 0;

		if (data.discount) {
			discount = parseInt(data.discount.replace(new RegExp(' ','g'), ''));
		}
		// На странице корзины
        $('.cart-sum .value > .val').text(total + discount);
		$('.cart-total .value > .val').text(total);
		// В шапке сайта
		$('#header .cart span.count').text(data.count);
		$('#header .cart span.total').text(total);
    }

	// Удаление позиций из корзины
	$('.cart').on('click', 'a.delete', function () {
		var $tr = $(this).closest('tr');
        $.post('delete/', {html: 0, id: $tr.data('id')}, function (response) {
            if (response.data.count == 0) {
                location.reload();
            }
            $tr.fadeOut();
            updateCart(response.data);
        }, 'json');
        return false;
	});
	
	// Изменение количества товара
    $('.cart').on('change', 'input.qty', function () {
        var $this = $(this);
        if ($this.val() > 0) {
            var $tr = $(this).closest('tr');
            if ($this.val()) {
                $.post('save/', {html: 0, id: $tr.data('id'), quantity: $this.val()}, function (response) {
                    $tr.find('.sum').html(response.data.item_total);
                    if (response.data.q) {
                        $this.val(response.data.q);
                    }
                    if (response.data.error) {
                        alert(response.data.error);
                    } else {
                        $this.removeClass('error');
                    }
                    updateCart(response.data);
                }, 'json');
            }
        } else {
            that.val(1);
        }
    });

});