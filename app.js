const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const path = require('path');
const {get404} = require("./controllers/error");
let mongoConnect = require("./util/database");

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");

app.use(bodyParser.urlencoded({
    extended: false
}));

// app.use(express.static(path.join(__dirname, 'public')));

// app.use('/admin', adminRoutes);

/*app.use(adminRoutes);*/

// app.use(shopRoutes);

// app.use(get404);
app.listen(6969);