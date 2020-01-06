const {User} = require("../models/user");
const {hash, compare} = require("bcryptjs");
const nodemailer = require("nodemailer");
const sendGridTransport = require("nodemailer-sendgrid-transport");

const transporter = nodemailer.createTransport(sendGridTransport({
    auth: {
        api_key: "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"
    }
}));
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
                    return transporter.sendMail({
                        to: email,
                        from: 'admin@adminShop.com',
                        subject: 'Signup succeeded',
                        html: '<h1>You Successfully Signed up</h1>'
                    }); //returned a promise
                })
        } ).catch(function (err) {
        console.log();
    });
};
