const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const {get404} = require("./controllers/error");
let {mongoConnect} = require("./util/database");

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const {User} = require("./models/user");

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use((req, res, next) => {
    User.findById("5e08beba493b7244aa1a8cf8")
        .then(function (user) {
            req.user = new User(user.name,user.email,user.cart,user._id); //storing it as a request
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
mongoConnect( function () {
    app.listen(6969);
});
