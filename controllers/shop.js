const Product = require("../models/products");

exports.getProducts = (req, res) => {
    Product.fetchAll((products) => { //given to it when it is passed
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'All Products',
            path: '/products',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });

    });
};
exports.getIndex = (req, res) => {
    Product.fetchAll((products) => { //given to it when it is passed
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });

    });
};


exports.getCart = (req, res) => {
    console.log(req);
    res.render('shop/cart', {
        path: '/cart',
        pageTitle: 'Your Cart',
    });
};

exports.getCheckout = (req, res) => {
    console.log(req);
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
    })
};