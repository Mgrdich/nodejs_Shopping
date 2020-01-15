const {Router} = require('express');

const router = Router();
const {getProducts, getIndex, getCart, postIncDec, getOrders, getProduct, postCart, postCartDeleteProduct, postOrder,getInvoice} = require('../controllers/shop');
const {isAuth} = require("../middleware/is-auth");

router.get('/', getIndex);

router.get('/products', getProducts);

router.get('/products/:productId', getProduct);

router.get('/cart', isAuth, getCart);

router.post('/cart', isAuth, postCart);

router.post('/cart-delete-item', isAuth, postCartDeleteProduct);

// router.get('/checkout', getCheckout);

router.get('/orders', isAuth, getOrders);

router.post('/create-order', isAuth, postOrder);

router.post('/cartQuantity', isAuth, postIncDec);

router.get('/orders/:orderId',isAuth , getInvoice);

module.exports = router;