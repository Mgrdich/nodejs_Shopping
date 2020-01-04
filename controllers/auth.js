exports.getLogin = (req, res) => {

    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuth:req.isLoggedIn
    });
};

exports.postLogin = (req, res) => {
    const {email, password} = req.body;
    res.setHeader('Set-Cookie','loggedIn=true; HttpOnly');
    if (email === 'mgo@mgo.com' && password === 'mgo') {
        res.redirect('/');
    }
};
