require('webrtc-adapter')

const nullf = ()=>{}

class Root {
  constructor(servers, mediaConstraints){
    const connection = new RTCPeerConnection(servers)
    this.onStreamURL = nullf
    this.onNetInfo = nullf
    this.onError = nullf

    this.offer = ()=>{
      navigator.getUserMedia(mediaConstraints, onStream, this.onError)
    }

    const onStream = stream =>{
      const streamURL = window.URL.createObjectURL(stream)
      this.onStreamURL(streamURL)
      connection.addStream(stream)
      const onLocalDescription = connection.setLocalDescription.bind(connection)
      connection.createOffer(onLocalDescription, this.onError)
    }

    connection.onicecandidate = event=>{
      if(event.candidate === null)
      this.onNetInfo(JSON.stringify(connection.localDescription))
    }

    window.hack2 = description =>{
      connection.setRemoteDescription(new RTCSessionDescription(description))
    }
  }
}

class Peer{
  constructor(servers){
    const connection = new RTCPeerConnection(servers)
    this.onError = nullf
    this.onStreamURL = nullf

    connection.onaddstream = event =>{
      const streamURL = window.URL.createObjectURL(event.stream)
      this.onStreamURL(streamURL)
    }

    this.answer = remoteDescription=>{
      connection.setRemoteDescription(remoteDescription)
      connection.createAnswer(onLocalDescription, this.onError)
    }

    const onLocalDescription = description =>{
      connection.setLocalDescription(description)
      console.log(JSON.stringify(description))
    }

    window.hack = description =>{  }
  }
}

exports.Root = Root
exports.Peer = Peer
