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

    save() {
        console.log(this);
        return db.execute(
            'insert into products values(?,?,?,?,?)',
            [this.title, this.description, this.imageUrl, this.price]
        );
    }

    static fetchAll() {
        return db.execute("select * from products");
    }

    static findById(id) {

    }

    static deleteById(id) {

    }
};






