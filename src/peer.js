require('webrtc-adapter')

function calculateMaxChildrenCount(){
  const mobile = []
  const oscpu = navigator.oscpu
  const isMobile = mobile.some(item=>{return item === oscpu})
  return isMobile ? 1 : 2
}

class SignalingChannel{
  constructor(socket){
    const SEND_DESCRIPTION = 'send_description'
    const REQUEST_DESCRIPTION = 'request_description'
    const AVAILABLE = 'available'
    const UNAVAILABLE = 'unavailable'

    this.description = null
    this.onDescription = Function.prototype

    this.requestDescription = title=>{
      console.log('SignalingChannel.requestDescription');
      socket.emit(REQUEST_DESCRIPTION, socket.id, title)
    }

    socket.on(REQUEST_DESCRIPTION, (origin, target) =>{
      console.log('on REQUEST_DESCRIPTION');
      if(target === socket.id){
        this.sendDescription(origin, this.description)
      }
    })

    this.sendDescription = (target, description)=>{
      console.log('SignalingChannel.sendDescription');
      socket.emit(SEND_DESCRIPTION, socket.id, target, description)
    }

    socket.on(SEND_DESCRIPTION, (origin, target, description) =>{
      console.log('on SEND_DESCRIPTION');
      if(target === socket.id){
        console.log(typeof(description));
        this.onDescription(origin, description)
      }
    })

    this.available = (title, location) =>{
      console.log('SignalingChannel.available');
      socket.emit(AVAILABLE, title, location, socket.id)
    }

    this.unavailable = ()=>{
      console.log('SignalingChannel.unavailable');
      socket.emit(UNAVAILABLE, socket.id)
    }
  }
}

class FluxoPeer {
  constructor(servers, socket){
    this.onError = Function.prototype
    this.displayStream = Function.prototype
    const signaling = new SignalingChannel(socket)
    const MAX_CHILDREN = calculateMaxChildrenCount()
    let connectedChildren = 0
    let stream = null
    let title = null
    let location = null

    this.offer = (constraints, _title, _location) => {
      title = _title
      location = _location
      navigator.getUserMedia(constraints, onStreamCaptured, this.onError)
    }

    const onStreamCaptured = _stream=>{
      stream = _stream
      this.displayStream(stream)
      createConnection(stream)
    }

    const createConnection = (stream)=>{
      if(connectedChildren >= MAX_CHILDREN){
        this.onError('cannot support more than ' + MAX_CHILDREN + ' connections')
        return null
      }
      connectedChildren++
      const connection = new RTCPeerConnection(servers)
      connection.addStream(stream)
      connection.onicecandidate = makeAvailable(connection)
      const setLocalDescription = connection.setLocalDescription.bind(connection)
      connection.createOffer(setLocalDescription, this.onError)
    }

    const makeAvailable = connection =>{
      return event=>{
        if(event.candidate === null) {
          signaling.description = connection.localDescription
          signaling.onDescription = (origin, description)=>{connectChild(connection, origin, description)}
          signaling.available(title, location)
        }
      }
    }

    const connectChild = (connection, origin, description)=>{
      console.log(description)
      const remoteDescription = new RTCSessionDescription(description)
      connection.setRemoteDescription(remoteDescription)
      createConnection(stream)
    }

    this.receive = (_title, _location)=>{
      title = _title
      location = _location
      const connection = new RTCPeerConnection(servers)
      connection.onaddstream = event =>{
        stream = event.stream
        this.displayStream(stream)
      }
      signaling.onDescription = (target, remoteDescription) =>{
        remoteDescription = new RTCSessionDescription(remoteDescription)
        connection.setRemoteDescription(remoteDescription)
        connection.createAnswer(description =>{
          connection.setLocalDescription(description)
          signaling.sendDescription(target, description)
        }, this.onError)
      }
      signaling.requestDescription(title)
    }
  }
}

exports.FluxoPeer = FluxoPeer
exports.SignalingChannel = SignalingChannel
