const Cart = require('./cart');

const {getDb} = require('../util/database');

const {mObjectId} = require("../util/utility");


module.exports = class Products {
    constructor(title, imageUrl, description, price, id) {
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
        this._id = new mObjectId(id);
    }

    save() { //edit and create mixed
        console.log("this",this);
        const db = getDb();
        let Dbpro;
        if (!this._id) {
            Dbpro = db.collection('products').updateOne({_id: this._id}, {$set: this});
        } else {
            Dbpro = db.collection('products').insertOne(this);
        }
        return Dbpro.then(function (result) {
            console.log();
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






