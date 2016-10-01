require('webrtc-adapter')

const nullf = ()=>{}

module.exports = class Peer {
  constructor(servers, mediaConstraints) {
    const connection = new RTCPeerConnection(servers)
    const localCandidates = []
    this.onError = nullf
    this.onStreamURL = nullf
    this.onNetInfo = nullf
    this.remoteDescription = null
    this.remoteCandidates = null

    this.offer = ()=>{
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


    this.answer = ()=>{
      connection.onaddstream = event =>{
        const streamURL = window.URL.createObjectURL(event.stream)
        this.onStreamURL(streamURL)
      }
      connection.setRemoteDescription(this.remoteDescription)
      console.log('answering...')
      connection.createAnswer(description=>{
        connection.setLocalDescription(description)
        console.log(JSON.stringify(description))
      }, this.onError)
    }


    window.hack = description =>{
      console.log('setting remote description')
      const desc = new RTCSessionDescription(description)
      connection.setRemoteDescription(desc)
    }
  }
}
