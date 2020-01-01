const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const {get404} = require("./controllers/error");
const mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const {User} = require("./models/user");

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use((req, res, next) => {

    User.findById("5e0cba048ac37ef54cfa7f57")
        .then(function (user) {
            req.user = user; //storing it as a request
            next();
        }).catch(function (err) {
        console.log(err);
    });

});

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);

app.use(adminRoutes);

app.use(shopRoutes);

app.use(get404);

mongoose.connect("mongodb://localhost:27017/ShopNode",{ useNewUrlParser: true, useUnifiedTopology: true  })
    .then(function () {
        app.listen(6969);
    }).catch(function (err) {
    console.log(err);
});
