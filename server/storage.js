const url = process.env.NODE_ENV === 'production'? 'mongodb://dev:dev123@ds145128.mlab.com:45128/bbliss_db' : 'mongodb://localhost:27017/bbliss'

const dbClient = require('mongodb').MongoClient

module.exports = function(onSuccess, onError){
  dbClient.connect(url, (err, db)=>{
    if(err)
    onError(err)
    else
    onSuccess(db)
  })
}
