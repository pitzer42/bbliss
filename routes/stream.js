const router = require('express').Router()
const path = require('path')
const storage = require('../src/storage')

router.get('/', (request, response, next)=>{
  storage((db)=>{
    const streams = db.collection('streams').find().toArray((error, results)=>{
      //res.render('listStreams.pug', {streams: results})
      response.json(results)
    })
  })
})

router.get('/new', (request, response, next)=>{
  response.end('<form>title:</form>')
})

router.get('/:streamid', (request, response, next)=>{
  if(request.params.streamid == 0)
  response.json(null)
  else if (request.params.streamid == 1)
  response.end('<video></video>')
})

router.post('/:streamId', (request, response, next)=>{
  const newStream = {title: request.body.title, root:123}
  const maxResources = assignResources(request.body)
  const newPeer = {
    location: request.body.location,
    resources: maxResources,
    maxResources: maxResources,
    candidates: request.body.candidates
  }
  storage((db)=>{
    db.collection('peers').save(newPeer, (error, results)=>{
      newStream.root = newPeer._id
      db.collection('streams').save(newStream)
    })
  })
  response.end('streamer.bundle.js')
})

function assignResources(requestBody){
  return 1
}


/*
router.get('/list', (req, res, next)=>{
storage((db)=>{
const streams = db.collection('streams').find().toArray((error, results)=>{
console.log(results)
res.render('listStreams.pug', {streams: results})
})
})
})

router.get('/new', (req, res, next)=>{
res.sendFile(path.join(__dirname, '../public/newStream.html'))
});

router.post('/new', (req, res, next)=>{
const item = req.body
storage((db)=>{
const dbItem = db.collection('streams').save(item, (err, result)=>{
if(err)
console.log(err)
else{
console.log('saved')
console.log('*************************')
console.log(item)
res.sendFile(path.join(__dirname, '../public/streaming.html'))
}
})
})
//TODO: Get stream ID for adding candidate latter
});
*/
module.exports = router;
