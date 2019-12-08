const {Router} = require('express');

const router = Router();
const {getProducts} = require('../controllers/shop');

router.get('/', getProducts);

// router.get('/products', getProducts);

// router.get('/cart ', getProducts);

// router.get('/checkout ', getProducts);

module.exports = router;