const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const cartStatSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cartItems: [{
        productId: {type: Schema.Types.ObjectId, ref: 'Product', required: true},
        quantity: {type: Number, required: true}
    }]
});

cartStatSchema.methods.addToStatCart = function (userId, product) {  //it cannot be done together because of the delete case
    const cartProductIndex = this["cartItems"].findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });
    let newQuantity = 1;
    const updatedCartItems = [...this["cartItems"]];

    if (cartProductIndex >= 0) {
        newQuantity = this["cartItems"][cartProductIndex].quantity + 1;
        updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
        updatedCartItems.push({
            productId: product._id,
            quantity: newQuantity //which mostly 1
        });
    }

    this["cartItems"] = updatedCartItems;

    return this.save();
};

exports.CartStat = mongoose.model('CartStat', cartStatSchema);