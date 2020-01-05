const {Router} = require('express');

const router = Router();

const {getLogin, postLogin, postLogout, getSignUp, postSignUp} = require("../controllers/auth.js");

router.get('/login', getLogin);

router.get('/signup', getSignUp);

router.post('/login', postLogin);

router.post('/logout', postLogout);

router.post('/signup', postSignUp);

module.exports = router;