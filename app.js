const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const {get404} = require("./controllers/error");
const mongoose = require("mongoose");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);

const MONGODB_URI = "mongodb://localhost:27017/ShopNode";

const store = new MongoDbStore({
    uri: MONGODB_URI,
    collection: 'sessions'
});

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const authRoutes = require("./routes/auth");
const {User} = require("./models/user");

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use(
    session({
        secret: 'my secret is long string',
        resave: false,
        saveUninitialized: false,
        store: store
    }));

app.use((req, res, next) => {

    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
         .then(user => {
            req.user = user; //to mongoose we link the functions to it
            next();
        }).catch(function (err) {
            console.log(err);
    });

});

app.use('/admin', adminRoutes);

app.use(shopRoutes);

app.use(authRoutes);

app.use(get404);

mongoose.connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(function () {
        app.listen(6969);
    }).catch(function (err) {
    console.log(err);
});
