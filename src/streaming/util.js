'use strict'

const ConnectionState = {connected: 'connected', disconnected: 'failed'}

function onaddstream(connection, f){
  try{
    if(connection.onaddtrack)
    connection.ontrack = connection.onaddtrack
    connection.ontrack = event=>{ f(event.streams[0]) }
  }catch(e){
    connection.onaddstream = event=>{ f(event.stream)}
  }
}

function addStream(connection, stream){
  try{
    const track = stream.getVideoTracks()[0];
    connection.sender = connection.addTrack(track, stream);
    console.log('+++++++++ sender ' + JSON.stringify(connection.sender))
  }catch(e){
    connection.addStream(stream)
  }
}

function removeStream(connection, stream){
  try{
    console.log('+++++++++ sender ' + JSON.stringify(connection.sender))
    connection.removeTrack(connection.sender)
  }catch(e){
    connection.removeStream(stream)
  }
}

exports.onaddstream = onaddstream
exports.addStream = addStream
exports.removeStream = removeStream
exports.ConnectionState = ConnectionState
