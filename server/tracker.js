const bbliss = require('./bblissServer')
const dictodot = require('./dictodot')
const clients = {}
const tree = {}
const NODE_ID_OFFSET = 0
const NODE_ID_LENGTH = 5

function addToClients(socket){
  const id = socket.client.id.slice(NODE_ID_OFFSET, socket.client.id.length)
  clients[id] = socket
}

function removeDuplicate(child){
  for(let node in tree){
    const i = tree[node].indexOf(child)
    if(i > -1){
      tree[node].splice(i, 1)
      return
    }
  }
}

function addToTree(parent, child){
  parent = parent.slice(0, NODE_ID_LENGTH)
  child = child.slice(0, NODE_ID_LENGTH)
  removeDuplicate(child)
  if(tree[parent])
  tree[parent].push(child)
  else
  tree[parent] = [child]
  console.log(dictodot(tree))
}

function removeFromTree(node){
  node = node.slice(NODE_ID_OFFSET, NODE_ID_OFFSET + NODE_ID_LENGTH)
  delete tree[node]
  for(let parent in tree){
    let children = tree[parent]
    let i = children.indexOf(node)
    if(i != -1){
      children.splice(i, 1)
    }
  }
  console.log(dictodot(tree))
}

function onAvailable(title, options, origin){
  bbliss.findStream(title, stream=>{
    if(stream){
      bbliss.addPeer(title, options, origin)
    }else{
      bbliss.insertStream(title, options, origin)
    }
  })
}

function onRequestDescription(origin, title){
  bbliss.findStream(title, stream =>{
    const leafId = stream.peers[0]
    const leaf = clients[leafId]
    if(leaf){
      bbliss.popPeer(title)
      if(leafId === origin)
      return onRequestDescription(origin, title)
      else
      leaf.emit('request_description', origin, stream.peers[0])
    }
    else
    console.log('leaf not found for ' + title)
  })
}

function onSendDescription(origin, target, description){
  const leaf = clients[target]
  if(leaf)
  leaf.emit('send_description', origin, target, description)
  else
  console.log('leaf not found for ' + target +' ' +socket.id)
}

function onDisconnect(socket){
  return ()=>{
    removeFromTree(socket.id)
    bbliss.deleteStream(socket.id)
  }
}

function hookClient(socket){
  addToClients(socket)
  socket.on('available', onAvailable)
  socket.on('request_description', onRequestDescription)
  socket.on('send_description', onSendDescription)
  socket.on('disconnect', onDisconnect(socket))

  socket.on('con', (parent, child)=>{
    addToTree(parent, child)
  })
}

exports.hookClient = hookClient
