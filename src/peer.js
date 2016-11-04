'use strict'

require('webrtc-adapter')

const ConnectionState = {connected: 'connected', failed: 'failed'}

class MediaPeer {
  constructor(servers, socket){
    console.log(socket.id)
    this.onError = Function.prototype
    this.displayStream = Function.prototype
    const signaling = new SignalingChannel(socket)
    const MAX_CHILDREN = calculateMaxChildrenCount()
    const children = []
    let parent = null
    let stream = null
    let title = null
    let options = null

    this.play = (streamTitle, peerOptions, mediaConstraints) =>{
      title = streamTitle
      options = peerOptions
      if(mediaConstraints)
      startStreaming(mediaConstraints)
      else
      watchStream()
    }

    const startStreaming = (mediaConstraints) => {
      navigator.getUserMedia(mediaConstraints, onStream, this.onError)
    }

    const watchStream = ()=>{
      parent = new RTCPeerConnection(servers)
      parent.onaddstream = event =>{ onStream(event.stream) }
      signaling.onReceiveDescription = onReceiveDescription
      signaling.requestDescription(title)
      parent.oniceconnectionstatechange = onParentConnectionChange
    }

    const onStream = streamObj=>{
      console.log('MediaPeer.onStream()')
      updateChildrenStream(streamObj)
      stream = streamObj
      this.displayStream(stream)
      acceptNextChild()
    }

    const updateChildrenStream = newStream=>{
      for(let i = 0; i<children.length; i++){
        children[i].removeStream(stream)
        children[i].addStream(newStream)
      }
    }

    const acceptNextChild = ()=>{
      if(children.length >= MAX_CHILDREN)
      return
      const child = new RTCPeerConnection(servers)
      children.push(child)
      child.onicecandidate = makeAvailable(child)
      child.addStream(stream)
      const setLocalDescription = child.setLocalDescription.bind(child)
      child.createOffer(setLocalDescription, this.onError)
    }

    const makeAvailable = child =>{
      return event=>{
        if(event.candidate === null) {
          signaling.description = child.localDescription
          signaling.onReceiveDescription = connectToChild
          signaling.available(title, options)
        }
      }
    }

    const connectToChild = (origin, description)=>{
      const child = children[children.length - 1]
      const remoteDescription = new RTCSessionDescription(description)
      child.setRemoteDescription(remoteDescription)
      child.oniceconnectionstatechange = onChildConnectionChange(child)
      acceptNextChild()
    }

    const onReceiveDescription = (target, remoteDescription) =>{
      parent.id = target//DEBUG
      remoteDescription = new RTCSessionDescription(remoteDescription)
      parent.setRemoteDescription(remoteDescription)
      const onAnswer = description =>{
        parent.setLocalDescription(description)
        signaling.sendDescription(target, description)
      }
      parent.createAnswer(onAnswer, this.onError)
    }

    const onParentConnectionChange = ()=>{
      const state = parent.iceConnectionState
      if(state === ConnectionState.connected)
      onParentConnected()
      else if(state === ConnectionState.failed)
      onParentDisconnected()
    }

    const onParentConnected = ()=>{
      signaling.con(parent.id)//DEBUG
    }

    const onParentDisconnected = ()=>{
      this.play(title, options)
    }

    const onChildConnectionChange = child=>{
      return ()=>{
        const state = child.iceConnectionState
        if(state === ConnectionState.failed)
        onChildDisconnected(child)
      }
    }

    const onChildDisconnected = child =>{
      child.close()
      const i = children.indexOf(child)
      children.splice(i, 1)
      acceptNextChild()
    }
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
    const REQUEST_DESCRIPTION_TIMEOUT = 5000

    let gotDescription = false

    this.description = null
    this.onReceiveDescription = Function.prototype

    this.requestDescription = title=>{
      gotDescription = false
      console.log('-> REQUEST_DESCRIPTION');
      socket.emit(REQUEST_DESCRIPTION, socket.id, title)
      const retry = ()=>{
        if(!gotDescription){
          this.requestDescription(title)
          console.log('retry REQUEST_DESCRIPTION')
        }
      }
      setTimeout(retry, REQUEST_DESCRIPTION_TIMEOUT)
    }

    socket.on(REQUEST_DESCRIPTION, (origin, target) =>{
      console.log('<- REQUEST_DESCRIPTION');
      if(target === socket.id){
        this.sendDescription(origin, this.description)
      }
    })

    this.sendDescription = (target, description)=>{
      console.log('-> SEND_DESCRIPTION');
      socket.emit(SEND_DESCRIPTION, socket.id, target, description)
    }

    socket.on(SEND_DESCRIPTION, (origin, target, description) =>{
      gotDescription = true
      console.log('<- SEND_DESCRIPTION');
      if(target === socket.id)
      this.onReceiveDescription(origin, description)
    })

    this.available = (title, options) =>{
      console.log('AVAILABLE');
      socket.emit(AVAILABLE, title, options, socket.id)
    }

    //Used o build a debug tree on the tracker
    this.con = (parent)=>{
      socket.emit('con', parent, socket.id)
    }
  }
}

exports.MediaPeer = MediaPeer
exports.SignalingChannel = SignalingChannel
