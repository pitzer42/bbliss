const router = require('express').Router()
const path = require('path')
const bbliss = require('./bblissServer')

router.get('/', (request, response, next)=>{
  bbliss.listStreams((results)=>{
    response.render('listStreams.pug', {streams: results})
  })
})

router.get('/new', (request, response, next)=>{
  response.render('createStream.pug')
})

router.get('/:title', (request, response, next)=>{
  const title = request.params.title
  bbliss.findStream(title,(stream)=>{
    response.render('watchStream.pug', {title: title})
  })
})

module.exports = router;
