const {Router} = require('express');

const router = Router();

const {getLogin, postLogin} = require("../controllers/auth.js");

router.get('/login', getLogin);

router.post('/login', postLogin);

module.exports = router;