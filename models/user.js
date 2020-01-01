const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    cart: {
        items: [{
            productId: {type: Schema.Types.ObjectId, required: true},
            quantity: {type: Number, required: true}
        }]
    }
});

exports.Product = mongoose.model('User', userSchema);