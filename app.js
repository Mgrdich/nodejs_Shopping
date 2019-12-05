const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const adminRoutes = require("./routes/admin");
const shopRoutes = require("./routes/shop");
const path = require('path');

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes.routes);

/*app.use(adminRoutes);*/

app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});
app.listen(6969);