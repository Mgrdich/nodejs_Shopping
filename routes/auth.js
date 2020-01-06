const {Router} = require('express');

const router = Router();

const {getLogin, postLogin, postLogout, getSignUp, postSignUp, getReset,postReset,getNewPassword,postNewPassword} = require("../controllers/auth.js");

router.get('/login', getLogin);

router.get('/signup', getSignUp);

router.get('/reset', getReset);

router.get('/new-password',getNewPassword);

router.post('/login', postLogin);

router.post('/logout', postLogout);

router.post('/signup', postSignUp);

router.post('/reset', postReset);

router.get('/reset/:token', getNewPassword);

router.post('/new-password',postNewPassword);

module.exports = router;