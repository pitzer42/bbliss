const $ = require('jquery')
const localizer = require('./localizer')
const sender = require('./sender')

const submitButton = $(':button')
const form = $('form[name="streamForm"]')
const titleInput = $('input[name=title]')
const platformInput = $('input[name=platform]')
const locationInput = $('input[name=location]')
const netInfoInput = $('input[name=netInfo]')
const subtitle = $('h2')

function enableSubmitButton(){
  submitButton.prop('disabled', false)
}

function disableSubmitButton(){
  submitButton.prop('disabled', true)
}

function postForm(){
  disableSubmitButton()
  $.ajax({
    url : form.attr('action'),
    type: "POST",
    data: form.serialize(),
    success: streamingUI,
    error: function (jXHR, textStatus, error) {
      console.log('form error: ' + error);
    }
  })
}

function streamingUI(){
  subtitle.text(titleInput.val())
  form.remove()
}

function fillHiddenInputs(){
  platformInput.val(navigator.platform)
  localizer((location)=>{
    locationInput.val(location)
    sender((netinfo)=>{
      netInfoInput.val(netinfo)
      enableSubmitButton()
    })
  })
}

disableSubmitButton()
fillHiddenInputs()
submitButton.click(postForm)
