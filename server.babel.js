import express from 'express'
const app = express()
const http = require('http').Server(app)
const fluxo = require('./routes/fluxoServerAPI')
const io = require('socket.io')(http)

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use('/', express.static('public'))
app.use('/app', require('./routes/fluxoAPP'))
app.use('/api', require('./routes/fluxoAPI'))

app.set('view engine', 'pug')
app.set('views', './views')

function addToClients(socket){
  const id = socket.id.slice(2, socket.id.length)
  console.log('saving ' + id)
  clients[id] = socket
}

const clients = {}

io.on('connection', socket=>{

  addToClients(socket)

  socket.on('available', (title, location, origin)=>{
    fluxo.insertStream(title, location, origin)
  })

  socket.on('request_description', (origin, title)=>{
    console.log('request_description origin:' + origin + ' title:' + title);
    fluxo.findStream(title, stream =>{
      const leaf = clients[stream.root]
      if(leaf)
      leaf.emit('request_description', origin, stream.root)
      else
      console.log('leaf not found for ' + stream.root +' ' +socket.id)
    })
  })

  socket.on('send_description', (origin, target, description)=>{
    console.log('send_description origin:' + origin + ' target:' + target);
    const leaf = clients[target]
    if(leaf)
      leaf.emit('send_description', origin, target, description)
    else
      console.log('leaf not found for ' + target +' ' +socket.id)
  })
})

http.listen(process.env.PORT || 3000)
console.log('running...')
