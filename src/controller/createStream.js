const $ = require('jquery')
const localizer = require('localizer')
const submitButton = $(':button')
const form = $('form[name="streamForm"]')
const titleInput = $('input[name=title]')
const platformInput = $('input[name=platform]')
const locationInput = $('input[name=location]')
const channelInput = $('input[name=channel]')
const netInfoInput = $('input[name=netInfo]')
const subtitle = $('h2')

function createStream(){
  disableSubmitButton()
  localizer(location=>{
    const title = titleInput.val()
    const socket = io()
    socket.on('connect', ()=>{
      const servers = null
      const mediaConstraints = {
        audio: false,
        video: true
      }
      const FluxoPeer = require('peer').FluxoPeer
      const source = new FluxoPeer(servers, socket)
      source.displayStream = displayStream
      source.onError = error =>{
        console.log('FluxoPeer error: ' + error)
      }
      source.offer(mediaConstraints, title, location)
      streamingUI()
    })
  })
}

function displayStream(stream){
  const streamURL = window.URL.createObjectURL(stream)
  const video = document.querySelector('video')
  video.src = streamURL
}

function enableSubmitButton(){
  submitButton.prop('disabled', false)
}

function disableSubmitButton(){
  submitButton.prop('disabled', true)
}

function streamingUI(){
  subtitle.html('<a href="/app/'+ titleInput.val() + '">' + titleInput.val() + '</a>')
  form.remove()
}

submitButton.click(createStream)
