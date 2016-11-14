'use strict'
const storage = require('./storage')

exports.insertStream = (title, location, root, onResult) =>{
  console.log('inserting ' + title + ', ' + location + ', ' + root)
  onResult = onResult || Function.prototype
  const newStream = {
    title: title.replace(' ', '_'),
    location: location,
    peers: [root]
  }
  storage((db)=>{
    const streams = db.collection('streams')
    const invokeOnResult = onResult.bind(null, newStream)
    streams.insert(newStream).then(invokeOnResult).catch(logError)
    db.close()
  }, logError)
}

exports.findStream = (title, onResult) => {
  storage(db=>{
    const streams = db.collection('streams')
    const invokeOnResult = result=>{onResult(result[0])}
    const customLog = error=>{logError('fluxoServer.findStream: ' + error)}
    streams.findOne({title: title}).then(onResult).catch(customLog)
    db.close()
  }, logError)
}

exports.addPeer = (title, location, origin)=>{
  storage(db=>{
    const streams = db.collection('streams')
    streams.updateOne({title: title}, { $push: { "peers" : origin } })
    db.close()
  }, logError)
}

exports.popPeer = title=>{
  storage(db=>{
    const streams = db.collection('streams')
    streams.updateOne({title: title}, { $pop: { "peers" : -1 } })
    db.close()
  }, logError)
}

exports.listStreams = onResult => {
  storage((db)=>{
    db.collection('streams').find().toArray().then(onResult).catch(logError)
    db.close()
  }, logError)
}

exports.availablePeers = (title, onResult) =>{
  storage(db=>{
    const streams = db.collection('streams')
    streams.findOne({title: title}).then(stream=>{
      onResult(stream.peers)
    }).catch(logError)
    db.close()
  })
}

function logError(error){
  console.log('DBERROR: ' + error)
}
