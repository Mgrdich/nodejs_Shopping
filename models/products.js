const Cart = require('./cart');

const {getDb} = require('../util/database');

module.exports = class Products {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    edit() {
/*
        return db.execute(
            'update products set title=? , description=? , imageUrl=?,price=? where  id=? and user=?',
            [this.title, this.description, this.imageUrl, this.price, this.id, 6969]
        );
*/
    }

    add() { //this is returning the whole chain
            const db = getDb();
            return db.collection('products').insertOne(this)
                .then(function (result) {
                    console.log(result);
            }).catch(function (err) {
                console.log(err);
            })
    }

    static fetchAll() {
/*
        return db.execute("select * from products");
*/
    }

    static findById(id) {
/*
        return db.execute('select * from products where id=?', [id]);
*/
    }

    static deleteById(id) {
/*
        return db.execute("delete from products where id=? and user=?", [id, 6969]);
*/
    }
};






