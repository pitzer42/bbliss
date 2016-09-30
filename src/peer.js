'use strict'

require('webrtc-adapter')

module.exports = class Peer {
  constructor(servers, mediaConstraints) {
    const connection = new RTCPeerConnection(servers)
    const localCandidates = []
    this.onError = this.onStreamURL = this.onNetInfo = ()=>{}

    this.start = ()=>{
      navigator.getUserMedia(mediaConstraints, onStreamReady, this.onError)
    }

    const onStreamReady = stream => {
      const streamURL = window.URL.createObjectURL(stream)
      this.onStreamURL(streamURL)
      connection.addStream(stream)
      const onLocalDescription = connection.setLocalDescription.bind(connection)
      connection.createOffer(onLocalDescription, this.onError)
    }

    connection.onicecandidate = event=>{
      if(event.candidate)
        localCandidates.push(event.candidate)
      else
        this.onNetInfo(netInfoJSON())
    }

    const netInfoJSON = ()=>{
      return JSON.stringify({
        candidates: localCandidates,
        description: connection.localDescription
      })
    }
  }
}
