'use strict'

require('webrtc-adapter')

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
  }catch(e){
    connection.addStream(stream)
  }
}

function removeStream(connection, stream){
  try{
    connection.removeTrack(connection.sender)
  }catch(e){
    connection.removeStream(stream)
  }
}

function getStats(pc, selector) {
  if (navigator.mozGetUserMedia) {
    return pc.getStats(selector);
  }
  return new Promise(function(resolve, reject) {
    pc.getStats(function(response) {
      var standardReport = {};
      response.result().forEach(function(report) {
        var standardStats = {
          id: report.id,
          type: report.type
        };
        report.names().forEach(function(name) {
          standardStats[name] = report.stat(name);
        });
        standardReport[standardStats.id] = standardStats;
      });
      resolve(standardReport);
    }, selector, reject);
  });
}

exports.onaddstream = onaddstream
exports.addStream = addStream
exports.removeStream = removeStream
exports.ConnectionState = ConnectionState
exports.getStats = getStats
