exports.getLogin = (req, res) => {

    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuth:req.session.isLoggedIn
    });
};

exports.postLogin = (req, res) => {
    const {email, password} = req.body;

    req.session.isLoggedIn = true;

    if (email === 'mgo@mgo.com' && password === 'mgo') {
        res.redirect('/');
    }
};
