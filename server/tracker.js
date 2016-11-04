const fluxo = require('./fluxoServer')
const clients = {}
const tree = {}

function addToClients(socket){
  const id = socket.id.slice(2, socket.id.length)
  clients[id] = socket
}

function addToTree(parent, child){
  parent = parent.slice(0, 5)
  child = child.slice(0, 5)
  if(tree[parent])
  tree[parent].push(child)
  else
  tree[parent] = [child]
  console.log(JSON.stringify(tree))
}

function removeFromTree(node){
  node = node.slice(2,7)
  console.log('removing ' + node)
  delete tree[node]
  for(let parent in tree){
    console.log(parent)
    let children = tree[parent]
    let i = children.indexOf(node)
    if(i != -1){
      children.splice(i, 1)
    }
  }
  console.log(JSON.stringify(tree))
}

function onAvailable(title, options, origin){
  fluxo.findStream(title, stream=>{
    if(stream){
      fluxo.addPeer(title, options, origin)
    }else{
      fluxo.insertStream(title, options, origin)
    }
  })
}

function onRequestDescription(origin, title){
  fluxo.findStream(title, stream =>{
    const leafId = stream.peers[0]
    const leaf = clients[leafId]
    if(leaf){
      fluxo.popPeer(title)
      if(leafId === origin)
      return onRequestDescription(origin, title)
      else
      leaf.emit('request_description', origin, stream.peers[0])
    }
    else
    console.log('leaf not found for ' + stream.root +' ' +socket.id)
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
