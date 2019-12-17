const Product = require("../models/products");

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false
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

exports.getEditProduct = (req, res) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        if (!product) {
            res.redirect('/');
        }
        res.render('admin/edit-product', {
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product
        });
    });
};

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const updatedProduct = new Product(
        prodId,
        updatedTitle,
        updatedImageUrl,
        updatedDesc,
        updatedPrice
    );
    updatedProduct.save()
        .then(function () {
            res.redirect('/admin/products');
        }).catch(function (err) {
        console.log(err);
    })

};

exports.getProducts = (req, res) => {
    Product.fetchAll()
        .then(function ([data]) {
            res.render('admin/products', {
                prods: data,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                hasProducts: data.length > 0,
                activeShop: true,
                productCSS: true
            });
        }).catch(function (err) {
        console.log(err);
    });
};

exports.postDeleteProduct = (req, res) => {
    Product.deleteById(req.body.id);
    res.redirect('/products');
};