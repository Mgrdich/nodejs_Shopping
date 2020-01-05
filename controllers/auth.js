const {User} = require("../models/user");
const {hash, compare} = require("bcryptjs");

exports.getLogin = (req, res) => {
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',

    });
};

exports.getSignUp = (req, res) => {
    res.render('auth/signup', {
        pageTitle: 'Sign up',
        path: '/signup',

    });
};

exports.postLogin = (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email: email})
        .then(user => {
            if (!user) {
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
    console.log("signup");
    const email = req.body.email;
    const password = req.body.password;
    const confimPassword = req.body.confirmPassword;

    User.findOne({email: email})
        .then(function (userDoc) {
            console.log(userDoc);
            if (userDoc) {
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
                })
        }).catch(function (err) {
        console.log(err);
    });
};
