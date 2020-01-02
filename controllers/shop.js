const {Product} = require("../models/products");

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
    req.user.getOrders()
        .then(function (orders) {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Orders',
                orders: orders ? orders : []
            })
        });
};

exports.postOrder = (req, res) => {
    req.user
        .addOrder()
        .then(() => {
            res.redirect('/orders');
        }).catch(function (err) {
        console.log(err)
    });
};