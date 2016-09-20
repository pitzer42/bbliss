'use strict'
const storage = require('./storage')

exports.insertPeer = (location, platform, candidates, onResult) =>{
  const maxResources = assignResources(platform)
  const newPeer = {
    location: location,
    resources: maxResources,
    maxResources: maxResources,
    candidates: candidates
  }
  storage((db)=>{
    const peers = db.collection('peers')
    const invokeOnResult =  onResult.bind(null, newPeer)
    peers.insert(newPeer).then(invokeOnResult).catch(logError)
    db.close()
  })
}

exports.insertStream = (title, root, onResult) =>{
  const newStream = {
    title: title,
    root: root._id
  }
  storage((db)=>{
    const streams = db.collection('streams')
    const invokeOnResult = onResult.bind(null, newStream)
    streams.insert(newStream).then(invokeOnResult).catch(logError)
    db.close()
  })
}

exports.findStream = (title, onResult) => {
  storage((db)=>{
    const streams = db.collection('streams')
    const invokeOnResult = (result)=>{onResult(result[0])}
    streams.find({title: title}).toArray().then(invokeOnResult).catch(logError)
    db.close()
  })
}

exports.listStreams = (onResult) => {
  storage((db)=>{
    db.collection('streams').find().toArray().then(onResult).catch(logError)
    db.close()
  })
}

function assignResources(platform){
  return 1
}

function logError(error){
  console.log(error)
}

//TODO: remove in production
exports.reset = ()=>{
  storage((db)=>{
    db.collection('streams').drop()
    db.collection('peers').drop()
    db.close()
  })
}
