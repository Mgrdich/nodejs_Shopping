const {error500} = require("../util/utility");
const {Product} = require("../models/products");
const {Order} = require("../models/orders");
const path = require("path");
const fs = require("fs");
const PDFDocument = require('pdfkit');
const {sameObjectId} = require("../util/utility");

const ITEMS_PER_PAGE = 1;


exports.getProducts = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;

    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        })
        .then(products => {
            res.render('shop/product-list', {
                prods: products,
                pageTitle: 'Products',
                path: '/products',
                currentPage: page,
                hasNextPage: ITEMS_PER_PAGE * page < totalItems,
                hasPreviousPage: page > 1,
                nextPage: page + 1,
                previousPage: page - 1,
                lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
            });
        })
        .catch(function (err) {
            return error500(next, err);
        });
};
exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;

    Product.findById(prodId)
        .then(function (product) {
            res.render('shop/product-detail', {
                product: product,
                pageTitle: product.title,
                path: `/products`,
            });
        }).catch(function (err) {
        return error500(next, err);
    })
};

exports.getIndex = (req, res, next) => {
    const page = +req.query.page || 1;
    let totalItems;

    Product.find()
        .countDocuments()
        .then(numProducts => {
            totalItems = numProducts;
            return Product.find()
                .skip((page - 1) * ITEMS_PER_PAGE)
                .limit(ITEMS_PER_PAGE);
        }).then(products => {
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop',
            path: '/',
            currentPage: page,
            hasNextPage: ITEMS_PER_PAGE * page < totalItems,
            hasPreviousPage: page > 1,
            nextPage: page + 1,
            previousPage: page - 1,
            lastPage: Math.ceil(totalItems / ITEMS_PER_PAGE)
        });
    }).catch(function (err) {
        return error500(next, err);
    });
};

exports.getCart = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(function (user) {
            const products = user.cart.items;
            console.log(products);
            res.render('shop/cart', {
                path: '/cart',
                pageTitle: 'Your Cart',
                products: products.length ? products : [],
            });
        }).catch(function (err) {
        return error500(next, err);
    })
};

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
        .then(function (product) {
            return req.user.addToCart(product); //Wow;
        }).then(function () {
        res.redirect('/');
    }).catch(function (err) {
        return error500(next, err);
    })
};

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user.removeFromCart(prodId)
        .then(function () {
            res.redirect('/cart');
        }).catch(function (err) {
        return error500(next, err);
    })
};

exports.getCheckout = (req, res) => {
    res.render('shop/checkout', {
        path: '/checkout',
        pageTitle: 'Checkout',
    })
};

exports.getOrders = (req, res, next) => {
    Order.find({'user.userId': req.user._id})
        .then(function (orders) {
            res.render('shop/orders', {
                path: '/orders',
                pageTitle: 'Orders',
                orders: orders ? orders : [],
            })
        }).catch(function (err) {
        return error500(next, err);
    });
};

exports.postOrder = (req, res, next) => {
    req.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(function (user) {
            const products = user.cart.items.map(i => ({quantity: i.quantity, product: {...i.productId._doc}}));  //accessing what is i like populate
            const order = new Order({
                user: {
                    email: req.user.email,
                    userId: req.user //mongoose does the rest
                },
                products: products
            });
            return order.save();
        }).then(function () {
        res.redirect('/orders');
        req.user.clearCart();
    }).catch(function (err) {
        return error500(next, err);
    });
};

exports.postIncDec = (req, res, next) => { //TODO make it with json
    const qtyAdd = +req.body.quantityValue; //converting it to number
    const prodId = req.body.productId;
    req.user.addProdQty(prodId, qtyAdd)
        .then(function () {
            res.redirect('/cart');
        }).catch(function (err) {
        return error500(next, err);
    })
};

exports.getInvoice = (req, res, next) => {
    const orderId = req.params.orderId;
    Order.findById(orderId)
        .then(order => {
            console.log("Start");
            if (!order) {
                return next(new Error('No order found.'));
            }
            console.log("start1");
            if (!sameObjectId(order.user.userId,req.user._id)) {
                return next(new Error('Unauthorized'));
            }
            const invoiceName = 'invoice-' + orderId + '.pdf';
            console.log(invoiceName);
            const invoicePath = path.join('data', 'invoices', invoiceName);
            
            const pdfDoc = new PDFDocument();
            res.setHeader('Content-Type', 'application/pdf');
            res.setHeader(
                'Content-Disposition',
                'inline; filename="' + invoiceName + '"'
            );
            pdfDoc.pipe(fs.createWriteStream(invoicePath));
            pdfDoc.pipe(res);

            pdfDoc.fontSize(26).text('Invoice', {
                underline: true
            });
            pdfDoc.text('-----------------------');
            let totalPrice = 0;
            order.products.forEach(prod => {
                totalPrice += prod.quantity * prod.product.price;
                pdfDoc
                    .fontSize(14)
                    .text(
                        prod.product.title +
                        ' - ' +
                        prod.quantity +
                        ' x ' +
                        '$' +
                        prod.product.price
                    );
            });
            pdfDoc.text('---');
            pdfDoc.fontSize(20).text('Total Price: $' + totalPrice);

            pdfDoc.end();
        }).catch(function (err) {
        next(err)
    });
};
