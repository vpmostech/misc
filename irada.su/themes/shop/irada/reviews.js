$(function() {
    /**
     * Hotkey combinations
     * {Object}
     */
    var hotkeys = {
        'alt+enter': {
            ctrl:false, alt:true, shift:false, key:13
        },
        'ctrl+enter': {
            ctrl:true, alt:false, shift:false, key:13
        },
        'ctrl+s': {
            ctrl:true, alt:false, shift:false, key:17
        }
    };

    var form_wrapper = $('#product-review-form');
    var form = form_wrapper.find('form');
    var content = $('#page-content .reviews');

    var input_rate = form.find('input[name=rate]');
    if (!input_rate.length) {
        input_rate = $('<input name="rate" type="hidden" value=0>').appendTo(form);
    }
    $('#review-rate').rateWidget({
		withClearAction: false,
        onUpdate: function(rate) {
            input_rate.val(rate);
        }
    });

    content.off('click', '.review-reply, .write-review a').on('click', '.review-reply, .write-review a', function() { 
        var self = $(this);
        var item = self.parents('li:first');
        var parent_id = parseInt(item.attr('data-id'), 10) || 0;
        prepareAddingForm.call(self, parent_id);
        $('.review').removeClass('in-reply-to');
        item.find('.review:first').addClass('in-reply-to');
        return false;
    });

    form.submit(function() {
        addReview();
        return false;
    });

    function addReview() {
        $.post(
            location.href.replace(/\/#\/[^#]*|\/#|\/$/g, '') + '/reviews/add/',
            form.serialize(),
            function (r) {
                if (r.status == 'fail') {
                    clear(form, false);
                    showErrors(form, r.errors);
                    return;
                }
                if (r.status != 'ok') {
                    if (console) {
                        console.error('Error occured.');
                    }
                    return;
                }
				location.reload();
				return;
            },
        'json')
        .error(function(r) {
            if (console) {
                console.error(r.responseText ? 'Error occured: ' + r.responseText : 'Error occured.');
            }
        });
    };

    function showErrors(form, errors) {
        for (var name in errors) {
            $('[name='+name+']', form).after($('<em class="errormsg"></em>').text(errors[name])).addClass('error');
        }
    };

    function clear(form, clear_inputs) {
        clear_inputs = typeof clear_inputs === 'undefined' ? true : clear_inputs;
        $('.errormsg', form).remove();
        $('.error',    form).removeClass('error');
        $('.wa-captcha-refresh', form).click();
        if (clear_inputs) {
            $('input[name=captcha], textarea', form).val('');
            $('input[name=rate]', form).val(0);
            $('input[name=title]', form).val('');
            $('.rate', form).trigger('clear');
        }
    };

    function prepareAddingForm(review_id)
    {
        var self = this; // clicked link
        if (review_id) {
            self.parents('.actions:first').after(form_wrapper);
            $('.rate ', form).trigger('clear').parents('.review-field:first').hide();
        } else {
            self.parents('.write-review').after(form_wrapper);
            form.find('.rate').parents('.review-field:first').show();
        }
        clear(form, false);
        $('input[name=parent_id]', form).val(review_id);
        form_wrapper.show();
    };

    function addHotkeyHandler(item_selector, hotkey_name, handler) {
        var hotkey = hotkeys[hotkey_name];
        form.off('keydown', item_selector).on('keydown', item_selector,
            function(e) {
                if (e.keyCode == hotkey.key &&
                    e.altKey  == hotkey.alt &&
                    e.ctrlKey == hotkey.ctrl &&
                    e.shiftKey == hotkey.shift)
                {
                    return handler();
                }
            }
        );
    };
});