const {Product} = require("../models/products");
const {Order} = require("../models/orders");

exports.getProducts = (req, res) => {
    Product.find()
        .then(function (products) {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'All Products',
                path: '/products',
                hasProducts: products.length > 0,
            });
        }).catch(function (err) {
        console.log(err);
    });
};

exports.getProduct = (req, res) => {
    const prodId = req.params.productId;

    Product.findById(prodId)
        .then(function (product) {
            console.log(product);
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: `/products`,
            });
        }).catch(function (err) {
        console.log(err);
    })
};

exports.getIndex = (req, res) => {
    Product.find()
        .then(function (products) {
            res.render('shop/index', {
                prods: products,
                pageTitle: 'Shop',
                path: '/',
                hasProducts: products.length > 0,
            });
        }).catch(function (err) {
        console.log(err);
    });
};

exports.getCart = (req, res) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(function (user) {
            const products = user.cart.items;
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products.length ? products : []
            });
        }).catch(function (err) {
        console.log(err);
    })
};

exports.postCart = (req, res) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(function (product) {
            return req.user.addToCart(product); //Wow;
        }).then(function () {
        res.redirect('/');
    }).catch(function (err) {
        console.log(err);
    })
};

exports.postCartDeleteProduct = (req, res) => {
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId)
        .then(function () {
            res.redirect('/cart');
        }).catch(function (err) {
        console.log(err);
    })
};

//TODO implement decrement and increment method inside the cart

exports.getCheckout = (req, res) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
    })
};

exports.getOrders = (req, res) => {
    Order.find({ 'user.userId': req.user._id })
        .then(function (orders) {
            console.log(orders);
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Orders',
                orders: orders ? orders : []
            })
        });
};

exports.postOrder = (req, res) => { //TODO add a backup of cart that will never be deleted
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(function (user) {
            const products = user.cart.items.map(i => ({quantity: i.quantity, product: { ...i.productId._doc }}));  //accessing what is i like populate
            const order = new Order({
                user: {
                    name: req.user.name,
                    userId: req.user //mongoose does the rest
                },
                products: products
            });
            return order.save();
        }).then(function () {
        res.redirect('/orders');
        req.user.clearCart();
    }).catch(function (err) {
        console.log(err);
    });
};