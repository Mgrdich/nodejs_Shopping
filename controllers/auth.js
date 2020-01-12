const {User} = require("../models/user");
const {hash, compare} = require("bcryptjs");
// const nodemailer = require("nodemailer");
const crypto = require("crypto");
const {error500} = require("../util/utility");
const {validationResult} = require("express-validator");
// const sendGridTransport = require("nodemailer-sendgrid-transport"); //TODO change me

exports.getLogin = (req, res) => {
    let mess = req.flash('error');
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: mess.length ? mess : null,
        oldInput: {
            email: '',
            password: ''
        },
        validationErrors: []
    });
};

exports.getSignUp = (req, res) => {
    let mess = req.flash('error');
    res.render('auth/signup', {
        pageTitle: 'Sign up',
        path: '/signup',
        errorMessage: mess.length ? mess : null
    });
};

exports.getReset = (req, res) => {
    let mess = req.flash('error');
    res.render('auth/reset', {
        pageTitle: 'Reset',
        path: '/reset',
        errorMessage: mess.length ? mess : null
    });
};

exports.getNewPassword = (req, res,next) => {
    const token = req.params.token;
    User.findOne({resetToken: token, resetTokenExp: {$gt: Date.now()}})
        .then(user => {
            let message = req.flash('error');
            if (!user) {
                return res.redirect('/');
            }
            res.render('auth/newpassword', {
                path: '/new-password',
                pageTitle: 'New Password',
                errorMessage: message.length ? message : null,
                userId: user._id.toString(),
                passwordToken: token
            });

        })
        .catch(err => {
            return error500(next,err);
        });
};

exports.postLogin = (req, res,next) => {
    const email = req.body.email;
    const password = req.body.password;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errArr = errors.array();
        return res.status(422).render('auth/login', {
            path: '/login',
            pageTitle: 'Login',
            errorMessage: errArr.length ? errArr[0].msg : '',
            oldInput: {
                email: email,
                password: password
            },
            validationErrors: errors.array()
        });
    }

    User.findOne({email: email})
        .then(user => {
            if (!user) {
                if (!user) {
                    return res.status(422).render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: 'Invalid email or password.',
                        oldInput: {
                            email: email,
                            password: password
                        },
                        validationErrors: errors.array()
                    });
                }
            }
            compare(password, user.password)
                .then(function (result) {
                    if (result) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save(function () {
                            res.redirect('/'); //after the save is done
                        });
                    }
                    return res.status(422).render('auth/login', {
                        path: '/login',
                        pageTitle: 'Login',
                        errorMessage: 'Invalid email or password.',
                        oldInput: {
                            email: email,
                            password: password
                        },
                        validationErrors: []
                    });
                });
        }).catch(function (err) {
        return error500(next,err);
    });
};

exports.postLogout = (req, res) => {
    req.session.destroy(function (err) {
        res.redirect('/');
        console.log(err);
    });
};

exports.postSignUp = (req, res,next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        const errArr = errors.array();
        return res.status(422).render('auth/signup', {
            pageTitle: 'Sign up',
            path: '/signup',
            errorMessage: errArr.length ? errArr[0].msg : [],
            oldInput: {
                email: email,
                password: password,
                confirmPassword: confirmPassword
            },
            validationErrors: errors.array()
        });
    }
    hash(password, 12)
        .then(function (hashedPassword) {

            const user = new User({
                email: email,
                password: hashedPassword,
                cart: {items: []}
            });
            return user.save();

        }).then(function () {
        res.redirect('/login');
        /*return transporter.sendMail({
            to: email,
            from: 'admin@adminShop.com',
            subject: 'Signup succeeded',
            html: '<h1>You Successfully Signed up</h1>'
        }); //returned a promise
        */
    }).catch(function (err) {
        return error500(next,err);
    });
};

exports.postReset = (req, res,next) => {
    const email = req.body.email;
    crypto.randomBytes(32, (err, buffer) => {
        if (err) {
            return res.redirect('/reset');
        }
        const token = buffer.toString('hex');
        User.findOne({email: email})
            .then(function (user) {
                if (!user) {
                    req.flash('error', "No account with this email");
                    return res.redirect('/reset');
                }
                user.resetToken = token;
                user.resetTokenExp = Date.now() + 3600000;
                return user.save();
            }).then(function () {
            res.redirect('/');
            /*return transporter.sendMail({
                to: email,
                from: 'admin@adminShop.com',
                subject: 'Password',
                html: `
                     <p>you Requested Password reset</p>
                    <p>click this <a href="http://localhost:6969/reset/${token}">link to reset the password</a></p>`
            });*/
        }).catch(function (err) {
            return error500(next,err);
        });
    });
};

exports.postNewPassword = (req, res,next) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passToken = req.body.passwordToken;

    let resetUser;

    User.findOne({
        resetToken: passToken,
        _id: userId,
        resetTokenExp: {$gt: Date.now()}
    }).then(function (user) { //TODO change with new Promise Constructor
            resetUser = user;
            return hash(newPassword, 12)
        }).then(function (hashedPass) {
        resetUser.password = hashedPass;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExp = undefined;
        return resetUser.save();
    }).then(function () {
        res.redirect('/login');
    }).catch(function (err) {
        return error500(next,err);
    });
};
