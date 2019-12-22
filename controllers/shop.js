const Product = require("../models/products");
const Cart = require("../models/cart");

exports.getProducts = (req, res) => {
    Product.fetchAll()
        .then(function ([data]) {
            res.render('shop/product-list', {
                prods: data,
                pageTitle: 'All Products',
                path: '/products',
                hasProducts: data.length > 0,
            });
        }).catch(function (err) {
        console.log(err);
    });
};

exports.getProduct = (req, res) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(function ([product]) {
            res.render('shop/product-detail', {
                product: product[0],
                pageTitle: product[0].title,
                path: `/products`,
            });
        }).catch(function (err) {
        console.log(err);
    })
};

exports.getIndex = (req, res) => {
    Product.fetchAll()
        .then(function ([data]) {
            res.render('shop/index', {
                prods: data,
                pageTitle: 'Shop',
                path: '/',
                hasProducts: data.length > 0,
            });
        }).catch(function (err) {
        console.log(err);
    });
};

exports.getCart = (req, res) => {
    Cart.getCart()
        .then(function ([data]) {
            console.log(data);
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: data.length ? data : []
            });
        }).catch(function (err) {
        console.log(err);
    })
};

exports.postCart = (req, res) => {
    const prodId = req.body.productId;
    Cart.findProductQuantity(prodId)
        .then(function ([data]) {
            let quantity = (data[0] && data[0].quantity) ? data[0].quantity : 0;
            return Cart.addProduct(prodId, quantity)
        })
        .then(function () {
            res.redirect('/cart'); //to update the page
        }).catch(function (error) {
        console.log(error);
    })
};

exports.postCartDeleteProduct = (req, res) => {
    const prodId = req.body.productId;
    Cart.deleteProduct(prodId).then(function () {
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
    res.render('shop/orders', {
        path: '/orders',
        pageTitle: 'Orders',
    })
};