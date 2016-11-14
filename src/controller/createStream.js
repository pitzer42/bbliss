const localizer = require('localizer')
const display = require('display')
const $ = require('jquery')
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
      const servers = 'stun:stun.l.google.com:19302'
      const mediaConstraints = {
        audio: false,
        video: true
      }
      const MediaPeer = require('../streaming/MediaPeer')
      const source = new MediaPeer(servers, socket)
      source.displayStream = display
      source.onError = error =>{
        console.log('MediaPeer error: ' + error)
      }
      source.play(title, location, mediaConstraints, )
      streamingUI()
    })
  })
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
