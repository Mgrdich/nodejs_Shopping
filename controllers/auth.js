const {User} = require("../models/user");

exports.getLogin = (req, res) => {

    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuth: req.session.isLoggedIn
    });
};

exports.postLogin = (req, res) => {
    User.findById('5e0cba048ac37ef54cfa7f57')
        .then(user => {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(err => {
                console.log(err); //after the save is done 
                res.redirect('/');
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
