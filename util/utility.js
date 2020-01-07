const mongodb = require('mongodb');

const mObjectId = mongodb.ObjectId;

exports.mObjectId = mObjectId;


exports.sameObjectId = function (objId1, objId2) {
    return objId1.toString() === objId2.toString();
};