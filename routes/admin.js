const {getAddProduct, postProductPage,getProducts} = require("../controllers/admin");
const {Router} = require('express');

// const path = require('path');
// const rootDir = require('../util/path');
const router = Router();

router.get('/add-product', getAddProduct);

router.get('/product', getProducts);

router.post('/add-product', postProductPage);

module.exports = router;