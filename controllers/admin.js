const Product = require("../models/products");

exports.getAddProduct = (req, res) => {
    res.render('admin/add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};

exports.postProductPage = (req, res) => {
    const product = new Product(req.body.title);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res) => {
    Product.fetchAll((products) => { //given to it when it is passed
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products',
            path: '/admin/product',
            hasProducts: products.length > 0,
            activeShop: true,
            productCSS: true
        });

    });
};