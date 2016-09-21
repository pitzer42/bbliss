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
  console.log(request.body)
  fluxo.insertPeer(request.body.location, request.body.platform, request.body.candidate, (newPeer)=>{
    fluxo.insertStream(request.body.title, newPeer, (newStream)=>{
      response.end()
    })
  })
})

router.get('/:title', (request, response, next)=>{
  const title = request.params.title
  fluxo.findStream(title,(stream)=>{
    fluxo.findPeer(stream.root,(root)=>{
      console.log(root.candidates)
      response.end()
    })
  })
})

module.exports = router;
