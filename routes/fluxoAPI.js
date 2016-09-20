const router = require('express').Router()
const fluxo = require('../src/fluxoServerAPI')

router.get('/', (request, response, next)=>{
  fluxo.listStreams((results)=>{
    response.json(results)
  })
})

router.get('/:streamId', (request, response, next)=>{
  fluxo.findStream(request.params.streamId, (result)=>{
    response.json(result)
  })
})

router.post('/new', (request, response, next)=>{
  fluxo.insertPeer(request.body.location, request.body.platform, request.body.candidates, (newPeer)=>{
    fluxo.insertStream(request.body.title, newPeer, (newStream)=>{
      response.end('streamer.bundle.js')
    })
  })
})

module.exports = router;
