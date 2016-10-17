'use strict'
const storage = require('./storage')

exports.insertStream = (title, location, root, onResult) =>{
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
    streams.find({title: title}).toArray().then(invokeOnResult).catch(logError)
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

exports.popPeer = (title)=>{
  storage(db=>{
    const streams = db.collection('streams')
    streams.updateOne({title: title}, { $pop: { "peers" : -1 } })
    db.close()
  }, logError)
}

exports.insertPeer = (location, platform, netInfo, onResult) =>{
  const maxResources = assignResources(platform)
  const newPeer = {
    location: location,
    resources: maxResources,
    maxResources: maxResources,
    netInfo: netInfo
  }
  storage((db)=>{
    const peers = db.collection('peers')
    const invokeOnResult =  onResult.bind(null, newPeer)
    peers.insert(newPeer).then(invokeOnResult).catch(logError)
    db.close()
  }, logError)
}

exports.findPeer = (id, onResult) =>{
  storage((db)=>{
    const peers = db.collection('peers')
    const invokeOnResult = (result)=>{onResult(result[0])}
    peers.find({_id: id}).toArray().then(invokeOnResult).catch(logError)
    db.close()
  }, logError)
}

exports.listStreams = (onResult) => {
  storage((db)=>{
    db.collection('streams').find().toArray().then(onResult).catch(logError)
    db.close()
  }, logError)
}

function assignResources(platform){
  return 1
}

function logError(error){
  console.log(error)
}
