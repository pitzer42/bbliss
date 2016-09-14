const router = require('express').Router()
const path = require('path')
const storage = require('../src/storage')

router.get('/list', (req, res, next)=>{
  storage((db)=>{
    const streams = db.collection('streams').find().toArray((error, results)=>{
      console.log(results)
      res.render('listStreams.pug', {streams: results})
    })
  })
})

router.get('/new', (req, res, next)=>{
  res.sendFile( path.join(__dirname, '../public/newStream.html'))
});

router.post('/new', (req, res, next)=>{
  const item = req.body

  storage((db)=>{
    db.streams.save(item, (err, result)=>{
      if(err)
        console.log(err)
      else
        console.log('saved')
    })
  })

  res.redirect('/')
});

module.exports = router;
