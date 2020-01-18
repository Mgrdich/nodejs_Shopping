const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const path = require("path");
const {get404, get500} = require("./controllers/error");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const csrf = require("csurf");
const flash = require("connect-flash");
const {MONGODB_URI} = require("./routes/constants");
const multer = require('multer');



const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, `${new Date().toISOString()}-${file.originalname}`);
    }
});

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg') {
        cb(null, true);
    }
    cb(null, false);
};

const store = new MongoDbStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

const csrfProtection = csrf({});


app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const {PORT_NUMBER} = require("./routes/constants");
const {User} = require("./models/user");

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(multer({storage: fileStorage,fileFilter:fileFilter}).single('image'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/images',express.static(path.join(__dirname, 'images')));

app.use(
    session({
        secret: 'my secret is long string',
        resave: false,
        saveUninitialized: false,
        store: store
    }));

app.use(csrfProtection);

app.use((req, res, next) => {
    res.locals.isAuth = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
});

app.use(flash());

app.use((req, res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            if (!user) {
                return next();
            }
            req.user = user; //to mongoose we link the functions to it
            next();
        }).catch(function (err) {
        next(new Error(err));
    });
});


app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use(authRoutes);

app.use('/500', get500);

app.use(get404);

app.use((error, req, res, next) => {
    res.status(500).render('500', {
        pageTitle: 'Page Not Found',
        path: '/500',
    });
});

mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(function () {
        app.listen(PORT_NUMBER);
    }).catch(function (err) {
    console.log(err);
});
