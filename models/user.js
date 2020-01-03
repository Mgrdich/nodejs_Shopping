const mongoose = require('mongoose');
const {CartStat} = require("./cartStat");

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
            quantity: {type: Number, required: true}
        }]
    }
});

userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity //which mostly 1
        });
    }
    this.cart = {
        items: updatedCartItems
    };

    let promiseCartStat = CartStat.findOne({userId: this._id}).then((cartStat) => { //the promise of the addStat to chart
        if (cartStat) {
            return cartStat.addToStatCart(this._id, product);
        }
        const obj = new CartStat({userId: this._id, cartItems: []}); //to create it only with id
        return obj.addToStatCart(this._id, product)
    });

    return Promise.all([this.save(), promiseCartStat]); //the schema save
};

userSchema.methods.removeFromCart = function (productId) {
    this.cart.items = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });
    return this.save();
};

userSchema.methods.addProdQty = function (productId, qtyAdd) {

    let prodIndex = this.cart.items.findIndex(item => {
        return item.productId.toString() !== productId.toString();
    });

    if (prodIndex < 0) {
        return Promise.reject("not in the array");
    }
    this.cart.items[prodIndex].quantity += qtyAdd;

/*
    let promiseCartStat = CartStat.findOne({userId: this._id}).then((cartStat) => { //the promise of the addStat to chart
        //since it should be there to make this work
        return cartStat.addQtyStatCart(productId, qtyAdd);
    });
*/

    return Promise.all([this.save()/*, promiseCartStat*/]);

};

userSchema.methods.clearCart = function () {
    this.cart = {items: []};
    return this.save();
};

exports.User = mongoose.model('User', userSchema);