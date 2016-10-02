const $ = require('jquery')
const Peer = require('peer').Peer
const peer = new Peer(null)
const remoteDescription = JSON.parse($('input[name=netInfo]').val())

peer.onError = error=>{console.log(error)}
peer.onStreamURL = streamURL =>{
  const video = document.querySelector('video')
  video.src = streamURL
}

peer.answer(remoteDescription)
