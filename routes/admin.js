const {Router} = require('express');

const path = require('path');
const rootDir = require('../util/path');
const router = Router();
const pug= require('pug');
const products = [];
router.get("/add-product", (req, res) => {
    res.sendFile(path.join(rootDir, 'views', 'add-product.html'));
});

router.post('/add-product', (req, res) => {
    products.push({title:req.body.title});
    res.redirect('/');
});

exports.routes = router;
exports.products = products;