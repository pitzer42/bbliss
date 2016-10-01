const constraints = {
  audio: false,
  video: true
}
const servers = null

const Peer = require('peer')
const peer = new Peer(servers, constraints)

peer.onStreamURL = streamURL =>{
  const video = document.querySelector('video')
  video.src = streamURL
}

peer.onError = error =>{
  console.log('sender error: ' + error)
}

module.exports = (onReady)=>{
  peer.onNetInfo = netInfo =>{
    onReady(netInfo)
  }
  peer.start()
}
