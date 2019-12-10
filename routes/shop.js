const {Router} = require('express');

const router = Router();
const {getProducts, getIndex, getCart, getCheckout, getOrders, getProduct, postCart} = require('../controllers/shop');

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:productId', getProduct);

router.get('/cart', getCart);

router.post('/cart', postCart);

router.get('/checkout', getCheckout);

router.get('/orders', getOrders);

module.exports = router;