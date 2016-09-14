const $ = require('jquery')
const localizer = require('./localizer')

$(':submit').prop('disabled', true)

localizer((location)=>{
  $(':submit').prop('disabled', false)
  $('input[name=location]').val(location)
})

$('input[name=browser]').val(navigator.userAgent)
