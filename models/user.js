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


    static findById(id) {
        const db = getDb();
        return db.collection('users').findOne({_id: new mObjectId(id)})
            .catch(function (err) {
                console.log(err);
            });
    }

    /*-----------Cart functionality inside the User-----------*/
    getCart() {
        const db = getDb();
        const productIds = this.cart.items.map(i => i.productId);
        return db.collection('products').find({_id: {$in: productIds}}).toArray()
            .then((products) => {
                console.log("products:",products);
                return products.map(p => {
                    return {
                        ...p,
                        quantity: this.cart.items.find(i => {
                            return i.productId.toString() === p._id.toString();
                        }).quantity
                    }
                })
            })
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

    deleteItemFromCart(productId) {
        const updatedCartItems = this.cart.items.filter(function (cp) {
            return cp.productId.toString() !== productId.toString() ;
        });

        const db = getDb();
        return db
            .collection('users')
            .updateOne(
                {_id:new mObjectId(this._id)},
                {$set:{cart:{items:updatedCartItems}}}
            );
    }

}

exports.User = User;