import express from 'express'
const app = express()
const http = require('http').Server(app)
const fluxo = require('./server/fluxoServer')
const io = require('socket.io')(http)

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use('/', express.static('public'))
app.use('/app', require('./server/fluxoAPP'))

app.set('view engine', 'pug')
app.set('views', './views')

function addToClients(socket){
  const id = socket.id.slice(2, socket.id.length)
  clients[id] = socket
}

const clients = {}

io.on('connection', socket=>{
  console.log('************')

  addToClients(socket)

  socket.on('available', (title, location, origin)=>{
    console.log(origin + ' is available');
    fluxo.findStream(title, stream=>{
      if(stream){
        fluxo.addPeer(title, location, origin)
      }else{
        fluxo.insertStream(title, location, origin)
      }
    })
  })

  socket.on('request_description', (origin, title)=>{
    fluxo.findStream(title, stream =>{
      const leaf = clients[stream.peers[0]]
      if(leaf){
        leaf.emit('request_description', origin, stream.peers[0])
        fluxo.popPeer(title)
      }
      else
      console.log('leaf not found for ' + stream.root +' ' +socket.id)
    })
  })

  socket.on('send_description', (origin, target, description)=>{
    const leaf = clients[target]
    if(leaf)
    leaf.emit('send_description', origin, target, description)
    else
    console.log('leaf not found for ' + target +' ' +socket.id)
  })
})

http.listen(process.env.PORT || 3000)
console.log('running...')
