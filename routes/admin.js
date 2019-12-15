const {getAddProduct, postAddProduct,getProducts,getEditProduct,postEditProduct} = require("../controllers/admin");
const {Router} = require('express');

// const path = require('path');
// const rootDir = require('../util/path');
const router = Router();

// /admin/add-product => GET
router.get('/add-product', getAddProduct);

// /admin/products => GET
router.get('/products', getProducts);

// /admin/add-product => POST
router.post('/add-product', postAddProduct);

router.get('/edit-product/:productId',getEditProduct);

router.post('/edit-product',postEditProduct);

module.exports = router;