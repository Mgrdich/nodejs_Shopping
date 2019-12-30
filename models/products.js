 const {getDb} = require('../util/database');

const {mObjectId} = require("../util/utility");


module.exports = class Products {
    constructor(title, imageUrl, description, price, id,userId) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
        this.userId = userId;
        this._id = id ? new mObjectId(id) : null; //TODO check out the Setters and covert this piece of code

    }

    save() { //edit and create mixed
        const db = getDb();
        let Dbpro;
        if (this._id) {
            Dbpro = db.collection('products').updateOne({_id: this._id}, {$set: this});
        } else {
            Dbpro = db.collection('products').insertOne(this);
        }
        return Dbpro.then(function (result) {
        }).catch(function (err) {
            console.log(err);
        })
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products').find().toArray()
            .then(function (products) {
                return products;
            }).catch(function (err) {
                console.log(err);
            })
    }

    static findById(id) {
        const db = getDb();
        return db.collection('products').find({_id: new mObjectId(id)})
            .next()
            .then(function (product) {
                return product;
            }).catch(function (err) {
                console.log(err);
            });
    }

    static deleteById(id) {
        const db = getDb();
        return db.collection('products').deleteOne({_id: new mObjectId(id)})
            .catch(function (err) {
                console.log(err);
            })
    }
};






