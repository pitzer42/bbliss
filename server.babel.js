import express from 'express'
const app = express()
const http = require('http').Server(app)
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

io.on('connection', socket=>{
  console.log(socket.id)
  socket.on('description', description=>{
    io.emit('description', description)
  })
})

http.listen(process.env.PORT || 3000)
console.log('running...')
