const {getProductPage, postProductPage} = require("../controllers/products");
const {Router} = require('express');

// const path = require('path');
// const rootDir = require('../util/path');
const router = Router();

router.get('/add-product', getProductPage);


router.post('/add-product', postProductPage);

exports.routes = router;