const {error500} = require("../util/utility");
const {sameObjectId} = require("../util/utility");
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

exports.postAddProduct = (req, res,next) => {
    const title = req.body.title;
    // const imageUrl = req.body.imageUrl;
    const image = req.file;
    const price = req.body.price;
    const description = req.body.description;
    const errors = validationResult(req);

    if(!image) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/edit-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: 'Attached file is not an image',
            validationErrors: []
        });
    }

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'Add Product',
            path: '/admin/edit-product',
            editing: false,
            hasError: true,
            product: {
                title: title,
                price: price,
                description: description
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    const imageUrl = image.path;

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
        return error500(next,err);
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
                errorMessage: null,
                validationErrors: [],
                hasError: false,
            });
        })
};

exports.postEditProduct = (req, res, next) => {
    const updatedTitle = req.body.title;
    const updatedPrice = req.body.price;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDesc = req.body.description;
    const prodId = req.body.productId;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(422).render('admin/edit-product', {
            pageTitle: 'edit Product',
            path: '/admin/edit-product',
            editing: true,
            hasError: true,
            product: {
                title: updatedTitle,
                imageUrl: updatedImageUrl,
                price: updatedPrice,
                description: updatedDesc,
                _id: prodId
            },
            errorMessage: errors.array()[0].msg,
            validationErrors: errors.array()
        });
    }

    Product.findById(prodId).then(function (product) {
        if (!sameObjectId(product.userId, req.user._id)) {
            res.redirect('/');
            return Promise.reject();
        }
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDesc;
        return product.save();
    }).then(function () {
        res.redirect('/admin/products');
    }).catch(function (err) {
        return error500(next,err);
    });
};

exports.getProducts = (req, res,next) => {
    Product.find({userId: req.user._id}) //thanks to the middleware
        .then(function (products) {
            res.render('admin/products', {
                prods: products,
                pageTitle: 'Admin Products',
                path: '/admin/products',
                hasProducts: products.length > 0,
            });
        }).catch(function (err) {
        return error500(next,err);
    });
};

exports.postDeleteProduct = (req, res,next) => {
    Product.deleteOne({_id: req.body.id, userId: req.user._id})
        .then(function () {
            res.redirect('/products');
        }).catch(function (err) {
        return error500(next,err);
    });

};