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

exports.postAddProduct = (req, res) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(title, imageUrl, description, price);
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