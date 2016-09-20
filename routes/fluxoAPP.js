const router = require('express').Router()
const path = require('path')
const fluxo = require('../src/fluxoServerAPI')

router.get('/', (request, response, next)=>{
  fluxo.listStreams((results)=>{
    response.render('listStreams.pug', {streams: results})
  })
})

router.get('/new', (request, response, next)=>{
  response.sendFile(path.join(__dirname, '../public/newStream.html'))
})

router.post('/new', (request, response, next)=>{
  fluxo.insertPeer(request.body.location, request.body.platform, request.body.candidates, (newPeer)=>{
    fluxo.insertStream(request.body.title, newPeer, (newStream)=>{
      response.end()
    })
  })
})

router.get('/:streamid', (request, response, next)=>{
  if(request.params.streamid == 0)
  response.end('Stream not found')
  else
  response.end('<video></video>')
})

module.exports = router;
