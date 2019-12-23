const Cart = require('./cart');

const {db} = require('../util/database');

module.exports = class Products {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    edit() {
        return db.execute(
            'update products set title=? , description=? , imageUrl=?,price=? where  id=? and user=?',
            [this.title, this.description, this.imageUrl, this.price, this.id, 6969]
        );
    }

    add() {
        return db.execute('insert into products values(default,?,?,?,?,?)',
            [this.title, this.description, this.imageUrl, this.price, 6969]);
    }

    static fetchAll() {
        return db.execute("select * from products");
    }

    static findById(id) {
        return db.execute('select * from products where id=?', [id]);
    }

    static deleteById(id) {
        return db.execute("delete from products where id=? and user=?", [id, 6969]);
    }
};






