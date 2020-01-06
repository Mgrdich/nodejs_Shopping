const {User} = require("../models/user");
const {hash, compare} = require("bcryptjs");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const sendGridTransport = require("nodemailer-sendgrid-transport"); //TODO change me


exports.getLogin = (req, res) => {
    let mess = req.flash('error');
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        errorMessage: mess.length ? mess : null
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

exports.getNewPassword = (req, res) => {
    const token = req.params.token;
    User.findOne({resetToken: token,resetTokenExp:{$gt:Date.now()}})
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
            console.log(err);
        });
};

exports.postLogin = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
        .then(user => {
            if (!user) {
                req.flash("error", "Invalid email or password");
                return res.redirect('/login');
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
                    req.flash("error", "Invalid email or password");
                    res.redirect('/login');
                }).catch(function (err) {

            });

        }).catch(function (err) {
        console.log(err);
    });
};

exports.postLogout = (req, res) => {
    req.session.destroy(function (err) {
        res.redirect('/');
        console.log(err);
    });
};

exports.postSignUp = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const confimPassword = req.body.confirmPassword;

    User.findOne({email: email})
        .then(function (userDoc) {
            if (userDoc) {
                req.flash('error', 'Email exists already please pick different one');
                return res.redirect('/signup'); //bcz of this return is not a promise
            }
            return hash(password, 12)
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
                })
        }).catch(function (err) {
        console.log(err);
    });
};

exports.postReset = (req, res) => {
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
        }).catch(function () {

        });
    });
};

exports.postNewPassword = (req, res) => {
    const newPassword = req.body.password;
    const userId = req.body.userId;
    const passToken = req.body.passwordToken;

    let resetUser;

    User.findOne({
        resetToken: passToken,
        _id: userId,
        resetTokenExp: {$gt: Date.now()}
    })
        .then(function (user) {
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
        console.log(err);
    });
};
