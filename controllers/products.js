const Products = require("../models/products");

exports.getProductPage = (req, res) => {
    res.render('add-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        formsCSS: true,
        productCSS: true,
        activeAddProduct: true
    });
};

exports.postProductPage = (req, res) => {
    const product = new Products(req.body.title);
    product.save();
    res.redirect('/');
};

exports.getProducts = (req, res) => {
    const products = Products.fetchAll();
    res.render('shop', {
        prods: products,
        pageTitle: 'Shop',
        path: '/',
        hasProducts: products.length > 0,
        activeShop: true,
        productCSS: true
    });
};