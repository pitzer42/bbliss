const $ = require('jquery')
const servers = null
const netInfo = JSON.parse($('input[name=netInfo]').val())
const connection = new RTCPeerConnection(servers)
const localCandidates = []

connection.ontrack = (event)=>{
  const streamURL = window.URL.createObjectURL(event.streams[0])
  const video = document.querySelector('video')
  video.src = streamURL
}

connection.onicecandidate = (event)=>{
  if(event.candidate)
    localCandidates.push(event.candidate)
}

const candidates = netInfo.candidates
for(let i = 0; i < candidates.length; i++){
  let candidate = new RTCIceCandidate(candidates[i])
  connection.addIceCandidate(candidate)
}

const description = new RTCSessionDescription(netInfo.description)
connection.setRemoteDescription(description)

connection.createAnswer(onAnswerSuccess, onAnswerError)

function onAnswerSuccess(description){
  connection.setLocalDescription(description)
}

function onAnswerError(error){
  console.logError(error)
}
