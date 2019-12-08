const fs = require("fs");
const path = require('path');
const rootDir = require('../util/path');

const p = path.join(
    rootDir,
    'data',
    'products.json'
);


const getProductFromFile = cb => {
    fs.readFile(p, (err, fileContext) => {
        if (err) {
            cb([]);
        }
        cb(JSON.parse(fileContext));
    });
};

module.exports = class Products {
    constructor(title,imageUrl,description,price) {
        this.title = title;
        this.imageUrl =imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductFromFile((products) => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (errnoError) => {
                console.log(errnoError);
            });
        });
    }

    static fetchAll(cb) {
        getProductFromFile(cb);
    }
};