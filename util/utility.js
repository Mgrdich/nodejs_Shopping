const mongodb = require('mongodb');

const mObjectId = mongodb.ObjectId;

exports.mObjectId = mObjectId;


exports.sameObjectId = function (objId1, objId2) {
    return objId1.toString() === objId2.toString();
};

exports.error500 = function (next, err) { //TODO replace them later on
    const error = new Error(err);
    error.httpStatusCode = 500;
    return next(error);
};