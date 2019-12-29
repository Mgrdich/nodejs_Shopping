const {mObjectId} = require("../util/utility");
const {getDb} = require('../util/database');

class User {

    constructor(username, email, cart, id) {
        this.name = username;
        this.email = email;
        this.cart = cart; //{items:[]}
        this._id = new mObjectId(id);
    }


    save() {
        const db = getDb();
        return db.collection('users').insertOne(this);
    }

    addToCart(product) {
        const cartProductIndex = this.cart.items.findIndex(function (cp) {
            return cp.productId.toString() === product._id.toString();
        });
        let qty = 1;
        let updatedCartItems = [...this.cart.items];
        
        if (cartProductIndex >= 0) {
            qty = this.cart.items[cartProductIndex].quantity + 1;
            updatedCartItems[cartProductIndex].quantity = qty;
        } else {
            updatedCartItems.push({productId: new mObjectId(product._id), quantity: qty})
        }

        const updatedCart = {items: updatedCartItems};
        const db = getDb();
        return db.collection('users').updateOne({_id: this._id}, {$set: {cart: updatedCart}});

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