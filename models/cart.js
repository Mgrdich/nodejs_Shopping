const {db} = require('../util/database');

module.exports = class Cart {
    static addProduct(prodID, qty) { //TODO add a user to it
        if (!qty) { //when the is not in the cart
            return db.execute("insert into carts values (default,?,?,?)", [6969, 1, prodID]);
        }
        let quantity = qty + 1;
        return db.execute("update carts set quantity=? where userID=? and productID=?", [quantity, 6969,prodID])
    }

    static findProductQuantity(productId) { //TODO add a user to it
        return db.execute("select quantity from carts where userID=? and productID=?", [6969, productId])
    }

    static deleteProduct(id) {
        return db.execute("delete from carts where productID=?", [id])
    }

    static getCart() { //not here
        return db.execute("select *,carts.id as cartID from carts inner join products p on carts.productID = p.id where userID = ?", [6969]); //later on should be specified
    }
};
