const {Router} = require('express');

const router = Router();

router.get("/add-product", (req, res, next) => {
    res.send('' +
        '<h1>Hello addProduct</h1>' +
        '<form action="/product" method="post"><input type="text" name="title"></form>');
});

router.post('/product', (req, res, next) => {
    console.log(req.body);
    res.redirect('/');
});

module.exports = router;
