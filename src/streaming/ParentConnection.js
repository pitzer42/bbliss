'use strict'

require('webrtc-adapter')
const util = require('./util')

/** Downloads a stream from a peer */
class ParentConnection {

  constructor(servers, signaling){
    //public
    this.parentId = null
    this.onConnect = Function.prototype
    this.onStream = Function.prototype
    this.onDisconnect = Function.prototype
    this.onError = Function.prototype
    //private
    const connection = new RTCPeerConnection(servers)

    this.join = (streamTitle)=>{
      util.onaddstream(connection, this.onStream.bind(this))
      connection.oniceconnectionstatechange = handleConnectionStates
      signaling.onRequestDescriptionTimeout = this.join.bind(this, streamTitle)
      signaling.onReceiveDescription = onReceiveDescription
      signaling.requestDescription(streamTitle)
    }

    const onReceiveDescription = (parentId, remoteDescription)=>{
      this.parentId = parentId
      remoteDescription = new RTCSessionDescription(remoteDescription)
      connection.setRemoteDescription(remoteDescription)
      connection.createAnswer(answerDescription, this.onError)
    }

    const answerDescription = localDescription =>{
      connection.setLocalDescription(localDescription)
      signaling.sendDescription(this.parentId, connection.localDescription)
    }

    const handleConnectionStates = ()=>{
      const state = connection.iceConnectionState
      if(state === util.ConnectionState.connected)
        this.onConnect()
      else if(state === util.ConnectionState.disconnected){
        this.onDisconnect()
        connection.close()
      }
    }
  }
}

module.exports = ParentConnection
