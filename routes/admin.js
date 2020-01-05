const {getAddProduct, postAddProduct, getProducts, getEditProduct, postEditProduct, postDeleteProduct} = require("../controllers/admin");
const {Router} = require('express');

const router = Router();

const {isAuth} = require("../middleware/is-auth");

//admin/add-product => GET
router.get('/add-product', isAuth, getAddProduct);

// /admin/products => GET
router.get('/products', isAuth, getProducts);

router.post('/add-product', isAuth, postAddProduct);

router.get('/edit-product/:productId', isAuth, getEditProduct);

router.post('/edit-product', isAuth, postEditProduct);

router.post('/delete-product', isAuth, postDeleteProduct);

module.exports =  router;