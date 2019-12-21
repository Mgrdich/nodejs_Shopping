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
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: [data[0]]
            });
        }).catch(function (err) {
        console.log(err);
    })
};

exports.postCart = (req, res) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(function ([product]) {
            Cart.addProduct(prodId, product[0].price);
            res.redirect('/cart');
        });

};

exports.postCartDeleteProduct = (req, res) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(function ([product]) {
            Cart.deleteProduct(prodId, product.price);
            res.redirect('/cart');
        })
};

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