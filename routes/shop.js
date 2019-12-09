const {Router} = require('express');

const router = Router();
const {getProducts, getIndex, getCart, getCheckout, getOrders, getProduct} = require('../controllers/shop');

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:productId',getProduct);

router.get('/cart', getCart);

router.get('/checkout', getCheckout);

router.get('/orders', getOrders);

module.exports = router;