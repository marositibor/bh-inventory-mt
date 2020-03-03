const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("inventory.db");

class Product {
    constructor(id, name, categories, desclription) {
        this.id = id || undefined;
        this.name = name;
        this.categories = Array.isArray(categories) ? categories : [categories];
        this.description = description || "";
    }

    insert() {
        const self = this;

        const products_sql = "INSERT INTO products(name, description) VALUES (?,?)";
        const inventory_sql = "INSERT INTO inventory(product_id, stock) VALUES (?, 0)";

        return new Promise(function (resolve) {
            db.run(products_sql, [self.name, self.description], function (err) {
                if(err){
                    console.log(err.message);
                }
                self.id = this.lastID;
                db.run(inventory_sql,self.id, function (err) {
                    if(err){
                        console.log(err.message);
                    }
                    console.log(`Row(s) updated: ${this.changes}`);
                    resolve(self)
                })

            })
        })
    }

    insertCategories() {
        const self = this;

        const delete_sql = "DELETE FROM product_to_category WHERE product_id = ?";

        const values = self.categories.map(category => `(${self.id},?)`).join(",");

        const insert_sql = "INSERT INTO product_to_category(product_id, category_id) VALUES " + values;

        return new Promise(function (resolve) {
            db.serialize(()=>{
                db.run(delete_sql, self.id)
                .run(insert_sql, self.categories, function() {
                    console.log(`Row(s) updated: ${this.changes}`);

                    resolve(self);
                })
            });
        })
    }

    update() {
            const self = this;

            const update_sql = `UPDATE products SET name=?, description=? WHERE id = ?`;

            return new Promise(function (resolve) {
                db.run(update_sql, [self.name, self.description, self.id], function (err) {
                    if(err) console.log(err.message);
                    console.log(`Row(s) updated: ${this.changes}`);
                    resolve(self);
                })
            })


        }
    
    delete() {

    }
}

module.exports = Product;