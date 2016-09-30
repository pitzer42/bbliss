const $ = require('jquery')
const servers = null

const netInfo = JSON.parse($('input[name=netInfo]').val())
const candidates = netInfo.candidates
const description = new RTCSessionDescription(netInfo.description)
const connection = new RTCPeerConnection(servers)
const localCandidates = []

connection.ontrack = (event)=>{
  const streamURL = window.URL.createObjectURL(event.streams[0])
  const video = document.querySelector('video')
  video.src = streamURL
}

connection.onicecandidate = addLocalCandidate

function addLocalCandidate(event){
  if(event.candidate){
    localCandidates.push(event.candidate)
  }
}

for(let i = 0; i < candidates.length; i++){
  let candidate = new RTCIceCandidate(candidates[i])
  connection.addIceCandidate(candidate)
}

connection.setRemoteDescription(description)

connection.createAnswer(onAnswerSuccess, onAnswerError)

function onAnswerSuccess(description){
  console.log('onAnswerSuccess')
  connection.setLocalDescription(description)
}

function onAnswerError(error){
  console.logError(error)
}
