const Root = require('peer').Root

const constraints = {
  audio: false,
  video: true
}
const servers = null
const root = new Root(servers, constraints)

root.onStreamURL = streamURL =>{
  const video = document.querySelector('video')
  video.src = streamURL
}

root.onError = error =>{
  console.log('root error: ' + error)
}

module.exports = (onReady)=>{
  root.onNetInfo = onReady//root.onLocalDescription = onReady//
  root.offer()
}
