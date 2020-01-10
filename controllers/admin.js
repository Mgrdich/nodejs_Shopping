const {Product} = require("../models/products");
const {validationResult} = require("express-validator");

exports.getAddProduct = (req, res) => {
    res.render('admin/edit-product', {
        pageTitle: 'Add Product',
        path: '/admin/add-product',
        editing: false,
        errorMessage: null,
        validationErrors: [],
        hasError: false,
    });
};

exports.postAddProduct = (req, res) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/edit-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                imageUrl: imageUrl,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }
    const product = new Product({
        title: title,
        price: price,
        description: description,
        imageUrl: imageUrl,
        userId: req.user //it will pick the id for you mongoose
    });
    product.save()
        .then(function () {
            res.redirect('/');
        }).catch(function (err) {
        console.log(err);
    });

};

exports.getEditProduct = (req, res) => {
    const editMode = req.query.edit;
    if (!editMode) {
        return res.redirect('/');
    }
    const prodId = req.params.productId;
    Product.findById(prodId)
        .then(function (product) {
            if (!product) { //in the case of a single product
                res.redirect('/');
            }
            res.render('admin/edit-product', {
                pageTitle: 'Edit Product',
                path: '/admin/edit-product',
                editing: editMode,
                product: product,
                errorMessage: []
            });
        })
};

exports.postEditProduct = (req, res) => {
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const prodId = req.body.productId;
    Product.findById(prodId).then(function (product) {
        if (product.userId.toString() !== req.user._id.toString()) {
            res.redirect('/');
            return Promise.reject();
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDesc;
        return product.save();
    }).then(function () {
        res.redirect('/admin/products')
    }).catch(function (err) {
        console.log(err);
    });
};

exports.getProducts = (req, res) => {
    Product.find({userId: req.user._id}) //thanks to the middleware
        .then(function (products) {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                hasProducts: products.length > 0,
            });
        }).catch(function (err) {
        console.log(err);
    });
};

exports.postDeleteProduct = (req, res) => {
    Product.deleteOne({_id: req.body.id, userId: req.body._id})
        .then(function () {
            res.redirect('/products');
        }).catch(function (err) {
        console.log(err);
    });

};