const url = process.env.NODE_ENV === 'production'? 'mongodb://dev:dev123@ds033046.mlab.com:33046/fluxo' : 'mongodb://localhost:27017/fluxo'
const dbClient = require('mongodb').MongoClient

module.exports = function(onSuccess, onError){
  dbClient.connect(url, (err, db)=>{
    if(err)
    onError(err)
    else
    onSuccess(db)
  })
}
