const $ = require('jquery')
const localizer = require('./localizer')

$(':submit').prop('disabled', true)

$('input[name=platform]').val(navigator.platform)

localizer((location)=>{
  $(':submit').prop('disabled', false)
  $('input[name=location]').val(location)
})
