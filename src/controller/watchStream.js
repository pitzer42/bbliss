const display = require('display')
const $ = require('jquery')
const localizer = require('localizer')
const titleInput = $('input[name=title]')
const MediaPeer = require('../streaming/MediaPeer')
const servers = {
  'iceServers': [{
    'url': 'stun:stun.l.google.com:19302'
  }]
}
const socket = io()

socket.on('connect', ()=>{
  const peer = new MediaPeer(servers, socket)
  peer.onError = error=>{console.log(error)}
  peer.displayStream = display
  localizer(location=>{
    const title = titleInput.val()
    peer.play(title, location)
  })
})
