const {Router} = require('express');

// const path = require('path');
// const rootDir = require('../util/path');
const router = Router();
const {getProducts} = require("../controllers/products");

router.get('/', getProducts);

module.exports = router;