'use strict'

require('webrtc-adapter')

class FluxoPeer {
  constructor(servers, socket){
    this.onError = Function.prototype
    this.displayStream = Function.prototype
    const signaling = new SignalingChannel(socket)
    const MAX_CHILDREN = calculateMaxChildrenCount()
    const children = []
    let parent = null
    let stream = null
    let title = null
    let location = null

    this.offer = (constraints, _title, _location) => {
      title = _title
      location = _location
      navigator.getUserMedia(constraints, onStream, this.onError)
    }

    const onStream = _stream=>{
      stream = _stream
      this.displayStream(stream)
      acceptNextChild()
    }

    const acceptNextChild = ()=>{
      if(children.length >= MAX_CHILDREN){
        this.onError('cannot support more than ' + MAX_CHILDREN + ' children')
        return
      }
      const connection = new RTCPeerConnection(servers)
      children.push(connection)
      connection.onicecandidate = makeAvailable(connection)
      connection.addStream(stream)
      const setLocalDescription = connection.setLocalDescription.bind(connection)
      connection.createOffer(setLocalDescription, this.onError)
    }

    const makeAvailable = connection =>{
      return event=>{
        if(event.candidate === null) {
          signaling.description = connection.localDescription
          signaling.onReceiveDescription = connectToChild
          signaling.available(title, location)
        }
      }
    }

    const connectToChild = (origin, description)=>{
      const connection = children[children.length - 1]
      const remoteDescription = new RTCSessionDescription(description)
      connection.setRemoteDescription(remoteDescription)
      acceptNextChild()
    }

    this.receive = (_title, _location)=>{
      title = _title
      location = _location
      parent = new RTCPeerConnection(servers)
      parent.ontrack = event =>{ onStream(event.streams[0]) }
      signaling.onReceiveDescription = onReceiveDescription
      signaling.requestDescription(title)
      parent.onconnectionstatechange = event=>{console.log('*****' + parent.connectionState)}
      parent.oniceconnectionstatechange = triggerConnectionStateHandlers
    }

    const onReceiveDescription = (target, remoteDescription) =>{
      remoteDescription = new RTCSessionDescription(remoteDescription)
      parent.setRemoteDescription(remoteDescription)
      const onAnswer = description =>{
        parent.setLocalDescription(description)
        signaling.sendDescription(target, description)
      }
      parent.createAnswer(onAnswer, this.onError)
    }

    const triggerConnectionStateHandlers = ()=>{
      const state = parent.iceConnectionState
      if(state==='connected')
      onParentConnected()
      else if(state === 'failed')
      onParentDisconnected()
    }

    const onParentConnected = ()=>{}

    const onParentDisconnected = ()=>{
      this.receive(title, location)
    }
    window.hack = onParentDisconnected
  }
}

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
    this.onReceiveDescription = Function.prototype

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
      if(target === socket.id)
      this.onReceiveDescription(origin, description)
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

exports.FluxoPeer = FluxoPeer
exports.SignalingChannel = SignalingChannel
