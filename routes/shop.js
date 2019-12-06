const {Router} = require('express');

const router = Router();
const {getProducts} = require('../controllers/products');

router.get('/', getProducts);

module.exports = router;