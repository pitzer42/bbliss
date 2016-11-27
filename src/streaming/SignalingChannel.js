'use strict'

/**
* Implements a text protocol over websocket that allow peers to exchange SDP
* messages in a offer/answer model and notify tracker of availability
*/
class SignalingChannel{

  constructor(socket){
    //public
    this.description = null
    this.onReceiveDescription = Function.prototype
    this.onRequestDescriptionTimeout = Function.prototype
    //private
    const SEND_DESCRIPTION = 'send_description'
    const REQUEST_DESCRIPTION = 'request_description'
    const AVAILABLE = 'available'
    const REQUEST_DESCRIPTION_TIMEOUT = 20000
    let gotDescription = false

    /**
    * Sends a message to the tracker asking for a peer to send a description
    * of a given stream. After REQUEST_DESCRIPTION_TIMEOUT miliseconds calls
    * this.onRequestDescriptionTimeout
    * @param {string} streamTitle - title of an existing stream
    */
    this.requestDescription = streamTitle=>{
      gotDescription = false
      console.log('-> REQUEST_DESCRIPTION')//DEBUG
      socket.emit(REQUEST_DESCRIPTION, socket.id, streamTitle)
      const retry = ()=>{
        if(!gotDescription){
          //console.log('retry REQUEST_DESCRIPTION')//DEBUG
          this.onRequestDescriptionTimeout()
        }
      }
      setTimeout(retry, REQUEST_DESCRIPTION_TIMEOUT)
    }

    /** Answers REQUEST_DESCRIPTION with SEND_DESCRIPTION */
    socket.on(REQUEST_DESCRIPTION, (origin, target) =>{
      console.log('<- REQUEST_DESCRIPTION')//DEBUG
      if(target === socket.id && this.description){
        this.sendDescription(origin, this.description)
      }
    })

    /**
    * sends a message to the tracker asking for delivering a description to a
    * peer
    * @param {Integer} target - id of the target peer
    * @param {string} description - SDP message
    */
    this.sendDescription = (target, description)=>{
      console.log('-> SEND_DESCRIPTION')//DEBUG
      socket.emit(SEND_DESCRIPTION, socket.id, target, description)
    }

    /** Triggers onReceiveDescription when a SEND_DESCRIPTION arrives */
    socket.on(SEND_DESCRIPTION, (origin, target, description) =>{
      console.log('<- SEND_DESCRIPTION')//DEBUG
      gotDescription = true
      if(target === socket.id)
      this.onReceiveDescription(origin, description)
    })

    /**
    * Notifies tracker that this peer is available
    * @param {string} streamTitle - Title of the stream this peer is uploading
    * @param {dictionary} peerOptions - Options for helping the tracker to optimize
    *   peer selection @see:MediaPeer
    */
    this.available = (streamTitle, peerOptions) =>{
      console.log('AVAILABLE');
      socket.emit(AVAILABLE, streamTitle, peerOptions, socket.id)
    }

    //DEBUG: used o build a debug tree on the tracker
    this.con = (parent)=>{
      console.log(parent + ' -> ' + socket.id)
      socket.emit('con', parent, socket.id)
    }
  }
}

module.exports = SignalingChannel
