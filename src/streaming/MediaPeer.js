'use strict'

require('webrtc-adapter')
const SignalingChannel = require('./SignalingChannel')
const ParentConnection = require('./ParentConnection')
const ChildConnection = require('./ChildConnection')

/**
* Returns a maximun children value based on empirical observation considering
* this device`s resources
*/
function calculateMaxChildrenCount(){
  const mobile = []
  const oscpu = navigator.oscpu
  const isMobile = mobile.some(item=>{return item === oscpu})
  return isMobile ? 1 : 2
}

/**
* Coordinates states and comunication channels to download a stream and upload it
* to its children.
*/
class MediaPeer{

  /**
  * @param {string} servers - address of an ICE/TURN/STUN server
  * @param {io.socket} trackerSocket - socket connection with a tracker
  */
  constructor(servers, trackerSocket){
    console.log(trackerSocket.id)//DEBUG
    //public
    this.displayStream = Function.prototype
    this.onError = Function.prototype
    //private
    const MAX_CHILDREN = calculateMaxChildrenCount()
    let signaling = new SignalingChannel(trackerSocket)
    let stream = null
    let parent = null
    let children = []

    /**
    * Starts a new stream if {streamTitle} is not in the active streams
    * list in the tracker, or joins an existing stream.
    * @param {string} streamTitle - Title of a new or an existing stream
    * @param {dictionary} peerOptions - Options for helping the tracker to
    *     optimize peer selection. ex: {location:"123,523"}
    * @param {dictionary} mediaStreamConstraints - optinal if {streamTitle} is an
    *     existing stream. as described {here}{@link https://developer.mozilla.org/en-US/docs/Web/API/MediaStreamConstraints}
    */
    this.play = (streamTitle, peerOptions, mediaStreamConstraints)=>{
      console.log('MediaPeer.play')//DEBUG
      stream = {
        title: streamTitle,
        options: peerOptions,
        constraints: mediaStreamConstraints
      }
      if(stream.constraints)
      startStream()
      else
      joinStream()
    }

    /** Request access to the user`s media devices to capture a stream */
    const startStream = ()=>{
      console.log('MediaPeer.startStream')//DEBUG
      navigator.mediaDevices.getUserMedia(stream.constraints)
      .then(onStream)
      .catch(this.onError)
    }

    /** When start receiving a stream, display it and start distributing it */
    const onStream = tracks =>{
      console.log('MediaPeer.onStream')//DEBUG
      stream.tracks = tracks
      this.displayStream(tracks)
      acceptNextChild()
    }

    /** Join an existing stream by downloading it from another peer*/
    const joinStream = ()=>{
      console.log('MediaPeer.joinStream')//DEBUG
      parent = new ParentConnection(servers, signaling)
      parent.onError = this.onError
      parent.onStream = onStream
      parent.onDisconnect = rejoinStream
      parent.onConnect = () =>{ signaling.con(parent.parentId) }//DEBUG
      parent.join(stream.title)
    }

    /** When parent is disconnected close all children connecions and rejoin */
    const rejoinStream = ()=>{
      console.log('MediaPeer.rejoinStream')//DEBUG
      children.forEach(child=>{child.close()})
      children = []
      joinStream()
    }


    /** Upload stream to a new child if it has enough resources */
    const acceptNextChild = ()=>{
      console.log('MediaPeer.acceptNextChild')//DEBUG
      //Reject new child connections if there are no resources
      if(children.length >= MAX_CHILDREN){
        console.log('MediaPeer.rejectChild')//DEBUG
        return
      }
      const child = new ChildConnection(servers, signaling)
      child.onConnect = acceptNextChild
      child.onDisconnect = replaceChild(child)
      child.onError = this.onError
      child.setStream(stream)
      child.listen()
      children.push(child)
    }

    /** When a child is disconnected release resources to receive a new one */
    const replaceChild = child=>{
      return ()=>{
        console.log('MediaPeer.replaceChild')//DEBUG
        removeChild(child)
        acceptNextChild()
      }
    }

    /** Remove child from children list */
    const removeChild = child=>{
      const i = children.indexOf(child)
      if(i>-1)
      children.splice(i, 1)
    }
  }
}

module.exports = MediaPeer
