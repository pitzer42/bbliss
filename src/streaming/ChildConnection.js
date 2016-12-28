'use strict'

require('webrtc-adapter')
const util = require('./util')

/** Uploads a stream to a peer */
class ChildConnection{

  constructor(servers, signaling){
    //public
    this.streamTitle = null
    this.options = null
    this.onConnect = Function.prototype
    this.onDisconnect = Function.prototype
    this.onError = Function.prototype
    //private
    const connection = new RTCPeerConnection(servers)
    let stream = null
    let state = null
    let connected = false

    this.setStream = _stream =>{
      connection.oniceconnectionstatechange = handleConnectionStates
      connection.onicecandidate = gatherAllCandidates
      if(stream !== null)
      util.removeStream(connection, stream.tracks)
      stream = _stream
      util.addStream(connection, stream.tracks)
    }

    this.listen = ()=>{
      const setLocalDescription = connection.setLocalDescription.bind(connection)
      signaling.onReceiveDescription = acceptConnection
      connection.createOffer().then(setLocalDescription).catch(this.onError)
    }

    const gatherAllCandidates = event=>{
      //If all candidates were collected
      if(event.candidate === null){
        signaling.description = connection.localDescription
        signaling.available(stream.title, this.options)
      }
    }

    const acceptConnection = (childId, remoteDescription) =>{
      remoteDescription = new RTCSessionDescription(remoteDescription)
      connection.setRemoteDescription(remoteDescription).catch(this.onError)
    }

    const handleConnectionStates = ()=>{
      state = connection.iceConnectionState
      if(state === util.ConnectionState.connected){
        this.onConnect()
      }
      else if(state === util.ConnectionState.disconnected){
        connection.close()
        this.onDisconnect()
      }
    }

    this.close = connection.close.bind(connection)
  }
}

module.exports = ChildConnection
