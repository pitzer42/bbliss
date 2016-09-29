'use strict';

require('webrtc-adapter')

const servers = null
const constraints = {
  audio: false,
  video: true
};

let connection = new RTCPeerConnection(servers)
let localCandidatets = []
let localDescription = false
let onReady = null

function onStream(stream) {
  displayVideo(stream)
  connection.onicecandidate = addLocalCandidate
  connection.addStream(stream)
  connection.createOffer(onLocalDescription, logError)
}

function displayVideo(stream){
  const video = document.querySelector('video')
  video.src = window.URL.createObjectURL(stream)
}

function addLocalCandidate(event){
  if(event.candidate)
    localCandidatets.push(event.candidate)
}

function onLocalDescription(description){
  localDescription = description
  connection.setLocalDescription(localDescription)
  //Wait for more candidates
  setTimeout(onReady, 1000)
}

function getNetInfoJSON(){
  return JSON.stringify({
    candidates: localCandidatets,
    description: localDescription
  })
}

module.exports = (onready)=>{
  onReady = ()=>{
    onready(getNetInfoJSON())
  }
  navigator.getUserMedia(constraints, onStream, logError);
}

function logError(error) {
  console.log('sender error: ', error)
}
