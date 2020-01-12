exports.get404 = (req, res) => {
    res.status(404).render('404', {
        pageTitle: 'Page Not Found',
        path: '/404',

    });
};

exports.get500 = (req, res) => {
    res.status(500).render('500', {
        pageTitle: 'Page Not Found',
        path: '/500',

    });
};