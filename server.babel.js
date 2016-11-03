import express from 'express'
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
const tracker = require('./server/tracker')

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use('/', express.static('public'))
app.use('/app', require('./server/fluxoAPP'))

app.set('view engine', 'pug')
app.set('views', './views')

io.on('connection', socket=>{
  tracker.hookClient(socket)
})

http.listen(process.env.PORT || 3000)
console.log('running...')
