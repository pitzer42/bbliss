import express from 'express'
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({
  extended: true
}))

app.use('/', express.static('public'));
app.use('/stream', require('./routes/stream'));

app.set('view engine', 'pug');
app.set('views', './views')

app.listen(process.env.PORT || 3000);
console.log('running...')
