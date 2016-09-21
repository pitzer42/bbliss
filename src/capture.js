'use strict';

require('webrtc-adapter')

const constraints = {
  audio: false,
  video: true
};

const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1
};

let onCandidate = null

function displayVideo(stream) {
  const video = document.querySelector('video')
  window.stream = stream // stream available to console
  if (window.URL) {
    video.src = window.URL.createObjectURL(stream)
    const servers = null
    const connection = new RTCPeerConnection(servers)
    connection.onicecandidate = (event)=>{
      if(event.candidate)
        onCandidate(event.candidate.candidate)
    }
    connection.addStream(stream)
    connection.createOffer(offerOptions).then((desc)=>{
      connection.setLocalDescription(desc)
    })
  }
  else
  video.src = stream
}

function logError(error) {
  console.log('navigator.getUserMedia error: ', error)
}

module.exports = (onReady)=>{
  onCandidate = onReady
  navigator.getUserMedia(constraints, displayVideo, logError);
}
