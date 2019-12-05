const {Router} = require('express');

const path = require('path');
const rootDir = require('../util/path');
const router = Router();
const adminData = require('./admin');

router.get("/", (req, res) => {
    console.log(adminData.products);
    res.sendFile(path.join(rootDir, 'views', 'shop.pug.html'));
});

module.exports = router;