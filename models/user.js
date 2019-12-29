const {mObjectId} = require("../util/utility");
const {getDb} = require('../util/database');
class User {

    constructor(username,email) {
        this.name = username;
        this.email = email;
    }

    save() {
       const db = getDb();
       return db.collection('users').insertOne(this);
    }

    static findById(id) {
        const db = getDb();
        return db.collection('users').findOne({_id: new mObjectId(id)})
            .catch(function (err) {
                console.log(err);
            });
    }

}

exports.User = User;