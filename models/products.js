const fs = require("fs");
const path = require('path');
const rootDir = require('../util/path');

const p = path.join(
    rootDir,
    'data',
    'products.json'
);


const getProductsFromFile = cb => {
    fs.readFile(p, (err, fileContext) => {
        if (err) {
            cb([]);
        }
        cb(JSON.parse(fileContext));
    });
};

module.exports = class Products {
    constructor(id, title, imageUrl, description, price) {
        this.id = id;
        this.title = title;
        this.imageUrl = imageUrl;
        this.description = description;
        this.price = price;
    }

    save() {
        getProductsFromFile(products => {
            if (this.id) {
                const existingProductIndex = products.findIndex(
                    prod => prod.id === this.id
                );
                const updatedProducts = [...products];
                updatedProducts[existingProductIndex] = this;
                fs.writeFile(p, JSON.stringify(updatedProducts), err => {
                    console.log(err);
                });
            } else {
                this.id = Math.random().toString();
                products.push(this);
                fs.writeFile(p, JSON.stringify(products), err => {
                    console.log(err);
                });
            }
        });
    }

    static fetchAll(cb) {
        getProductsFromFile(cb);
    }

    static findById(id, cb) {
        getProductsFromFile(products => {
            const product = products.find(p => p.id === id);
            cb(product);
        })
    }

    static deleteById(id) {
        getProductsFromFile(products => {
            const filteredProducts = products.filter(item => item.id !== id);
            fs.writeFile(p, JSON.stringify(filteredProducts), err => {
                console.log(err);
            })
        });

    }
};