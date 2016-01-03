$(document).ready(function() {
    $('button.redeem').on('click', function() {
        var animal = $(this).attr('data-animal'),
            points = $(this).attr('data-points');

        $.post('/exchange', {"animal": animal, "points": points}, function(data) {
            location.reload();
        }).fail(function(err) {
            console.log('error');
        });
    });
});
