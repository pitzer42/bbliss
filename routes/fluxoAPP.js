const router = require('express').Router()
const path = require('path')
const fluxo = require('fluxoServerAPI')

router.get('/', (request, response, next)=>{
  fluxo.listStreams((results)=>{
    response.render('listStreams.pug', {streams: results})
  })
})

router.get('/new', (request, response, next)=>{
  response.render('sender.pug')
})

router.post('/new', (request, response, next)=>{
  fluxo.insertPeer(request.body.location, request.body.platform, request.body.netInfo, (newPeer)=>{
    fluxo.insertStream(request.body.title, newPeer, (newStream)=>{
      response.end()
    })
  })
})

router.get('/:title', (request, response, next)=>{
  const title = request.params.title
  fluxo.findStream(title,(stream)=>{
    fluxo.findPeer(stream.root,(root)=>{
      response.render('receiver.pug', {netInfo: root.netInfo})
    })
  })
})

module.exports = router;
