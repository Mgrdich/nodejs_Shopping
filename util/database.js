let MongoClient = require('mongodb').MongoClient;

let _db;
const mongoConnect = callback => {
    MongoClient.connect('mongodb://localhost:27017/ShopNode', {useUnifiedTopology: true}).then((r) => {
        _db = r.db();
        callback();
    }).catch(function (err) {
        console.log(err);
    })
};

const getDb = function () {
    if (_db) {
        return _db;
    }
    throw "No database found";
};

exports.mongoConnect = mongoConnect;
exports.getDb = getDb;


