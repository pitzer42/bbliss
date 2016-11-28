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
      util.onAddStream(connection, this.onStream.bind(this))
      connection.oniceconnectionstatechange = handleConnectionStates
      signaling.onRequestDescriptionTimeout = this.join.bind(this, streamTitle)
      signaling.onReceiveDescription = onReceiveDescription
      signaling.requestDescription(streamTitle)
    }

    const onReceiveDescription = (parentId, remoteDescription)=>{
      console.log('>>>>>>>>>>\n')
      console.log(JSON.stringify(remoteDescription))
      console.log('>>>>>>>>>>\n')

      let filtered = []
      let lines = remoteDescription.sdp.split('\n').forEach(line=>{
        if(line.indexOf('a') === -1 || line.indexOf('host') === -1)
        filtered.push(line)
        else
        console.log(line)
      })
      remoteDescription = {sdp: filtered.join('\n')}


      this.parentId = parentId
      remoteDescription = new RTCSessionDescription(remoteDescription)
      connection.setRemoteDescription(remoteDescription).then(()=>{
        connection.createAnswer().then(answerDescription).catch(this.onError)
      }).catch(this.onError)
    }

    const answerDescription = localDescription =>{
      connection.setLocalDescription(localDescription).then(()=>{
        signaling.sendDescription(this.parentId, connection.localDescription)
      }).catch(this.onError)
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
