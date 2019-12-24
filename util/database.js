let MongoClient = require('mongodb').MongoClient;


const mongoConnect = callback => {
    MongoClient.connect('mongodb://localhost:27017/test',{ useUnifiedTopology: true }).then((r) => {
        callback(r);
    }).catch(function (err) {
        console.log(err);
    })
};

module.exports = mongoConnect;


