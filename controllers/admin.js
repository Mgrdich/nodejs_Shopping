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