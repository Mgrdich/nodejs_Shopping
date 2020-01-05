const {Router} = require('express');

const router = Router();
const {getProducts, getIndex, getCart, postIncDec, getOrders, getProduct, postCart, postCartDeleteProduct,postOrder} = require('../controllers/shop');

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:productId', getProduct);

router.get('/cart', getCart);

router.post('/cart', postCart);

router.post('/cart-delete-item', postCartDeleteProduct);

// router.get('/checkout', getCheckout);

router.get('/orders', getOrders);

router.post('/create-order', postOrder);

router.post('/cartQuantity',postIncDec);

module.exports = router;