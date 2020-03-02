const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("inventory.db");

class Product {
    constructor(name, categories, description) {
        this.name = name;
        this.categories = Array.isArray(categories) ? categories : [categories];
        this.description = description || "";
    }

    insert() {

        const self = this;

        const products_sql = "INSERT INTO products(name, description) VALUES (?,?)";

        return new Promise(function (resolve) {
            db.run(products_sql, [self.name, self.description], function () {
                self.id = this.lastID;
                resolve(self.insertCategories())
            })
        })

    }

    insertCategories() {
        const self = this;

        const categories_sql = "INSERT INTO product_to_category(product_id, category_id) VALUES (?,?)";

        return new Promise(function (resolve) {
            db.serialize(function () {
                self.categories.forEach(category => {
                    db.run(categories_sql, [self.id, category], function () {
                    })
                })
                resolve(self)
            })
        })
    }

    update() {

    }


    deleteCategories() {
        
    }
}

module.exports = Product;