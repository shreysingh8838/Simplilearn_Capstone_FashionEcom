Stripe.setPublishableKey('pk_test_51L74AhSGmemSdne00IdNmgszZhxotOB3IDesE7RaRwnhPdrpA3QNjNo8j5l8q0bsBXsyGYNdCRmztCgdj8FX86AD00myD11LGn');
var $form = $('#checkout-form');

$form.submit(function (event) {
    $form.find('button').prop('disabled', true);
    Stripe.card.createToken({
        number: $('#cardNum').val(),
        cvc: $('#ccv').val(),
        exp_month: $('#expMonth').val(),
        exp_year: $('#expYear').val(),
        name: $('#nameOnCard').val()
    }, stripeResponseHandler);
    return false;
});

function stripeResponseHandler(status, response) {
    if (response.error) {
        // $('#error').removeClass('hidden');
        // $('#error').text(response.error.message);
        $('#charge-error').text(response.error.message);
        $('#charge-error').removeClass('hidden');
        $form.find('button').prop('disabled', false);
    } else {
        var token = response.id;
        $form.append($('<input type="hidden" name="stripeToken" />').val(token));
        $form.get(0).submit();
    }
}