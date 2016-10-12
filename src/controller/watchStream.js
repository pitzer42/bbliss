const $ = require('jquery')
const localizer = require('localizer')
const titleInput = $('input[name=title]')
const FluxoPeer = require('peer').FluxoPeer
const servers = null
const socket = io()

socket.on('connect', ()=>{
  const peer = new FluxoPeer(servers, socket)

  peer.onError = error=>{console.log(error)}

  peer.displayStream = stream =>{
    const streamURL = window.URL.createObjectURL(stream)
    const video = document.querySelector('video')
    video.src = streamURL
  }

  localizer(location=>{
    const title = titleInput.val()
    peer.receive(title, location)
  })
})
