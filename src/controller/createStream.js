const $ = require('jquery')
const localizer = require('localizer')

const submitButton = $(':button')
const form = $('form[name="streamForm"]')
const titleInput = $('input[name=title]')
const platformInput = $('input[name=platform]')
const locationInput = $('input[name=location]')
const netInfoInput = $('input[name=netInfo]')
const subtitle = $('h2')

const servers = null
const mediaConstraints = {
  audio: false,
  video: true
}
const Root = require('peer').Root
const root = new Root(servers, mediaConstraints)

root.onStreamURL = streamURL =>{
  const video = document.querySelector('video')
  video.src = streamURL
}

root.onError = error =>{
  console.log('root error: ' + error)
}

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
  localizer(location=>{
    locationInput.val(location)
    root.onNetInfo = localDescription =>{
      netInfoInput.val(localDescription)
      enableSubmitButton()
    }
    root.offer()
  })
}

disableSubmitButton()
fillHiddenInputs()
submitButton.click(postForm)

const socket = io()
socket.on('description', description=>{
  root.setRemoteDescription(JSON.parse(description))
})
