const {Router} = require('express');

const router = Router();

const {getLogin, postLogin, postLogout} = require("../controllers/auth.js");

router.get('/login', getLogin);

router.post('/login', postLogin);

router.post('/logout', postLogout);

module.exports = router;