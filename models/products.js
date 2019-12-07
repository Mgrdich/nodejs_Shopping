const fs = require("fs");
const path = require('path');
const rootDir = require('../util/path');

const p = path.join(
    rootDir,
    'data',
    'products.json'
);


module.exports = class Products {
    constructor(title) {
        this.title = title;
    }

    save() {
        fs.readFile(p, (err, fileContent) => {
            let products = [];
            if (!err) {
                // products = JSON.parse(fileContent);
            }
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (errnoError) => {
                console.log(errnoError);
            });
        });
    }

    static fetchAll() {
        fs.readFile(p, (err, fileContext) => {
            if (err) {
                return [];
            }
            return JSON.parse(fileContext);
        });
    }
};