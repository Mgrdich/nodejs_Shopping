const Product = require("../models/products");

exports.getProducts = (req, res) => {
    Product.fetchAll((products) => { //given to it when it is passed
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });

    });
};