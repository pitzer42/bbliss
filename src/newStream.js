const $ = require('jquery')
const localizer = require('./localizer')
const capture = require('./capture')

$(':submit').prop('disabled', true)

$('input[name=platform]').val(navigator.platform)

localizer((location)=>{
  $('input[name=location]').val(location)
  capture((candidate)=>{
    $('input[name=candidate]').val(candidate)
    $(':submit').prop('disabled', false)
  })
})

/*
$(':submit').click((event)=>{
console.log($('form#streamForm'))
console.log($('form#streamForm').serialize())
$.post('/app/new', $('form#streamForm').serialize())
$(':submit').prop('disabled', true)
event.preventDefault()
})
*/

$(document).ready(function () {
    $('#streamForm').on('submit', function(e) {
        e.preventDefault();
        $.ajax({
            url : $(this).attr('action') || window.location.pathname,
            type: "POST",
            data: $(this).serialize(),
            success: function (data) {
                console.log('streaming...')
            },
            error: function (jXHR, textStatus, errorThrown) {
                alert(errorThrown);
            }
        });
    });
});
