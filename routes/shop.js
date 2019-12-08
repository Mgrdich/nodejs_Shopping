const {Router} = require('express');

const router = Router();
const {getProducts, getIndex, getCart, getCheckout} = require('../controllers/shop');

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/cart ', getCart);

router.get('/checkout ', getCheckout);

module.exports = router;