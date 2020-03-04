const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("inventory.db");

class Product {
    constructor(id, name, categories, description) {
        this.id = id || undefined;
        this.name = name || "";
        this.categories = Array.isArray(categories) ? categories : [categories] || [];
        this.description = description || "";
    }

    static getAllProducts(category){

        const select = `SELECT  products.id as id, products.name as name, group_concat(categories.name) as category, group_concat(categories.id) as category_id, products.description FROM products LEFT JOIN product_to_category ON product_to_category.product_id = products.id LEFT JOIN categories ON product_to_category.category_id = categories.id `;
        const where = category == 0 ? `WHERE categories.id IS NOT ? ` : `WHERE categories.id = ? `;
        const group_by = `GROUP BY products.id`;

        const select_sql = select + where + group_by

        db.prepare(select_sql,)

        return new Promise((resolve, reject) => {
            db.all(select_sql, category,
              function(err, results) {
                if (err) {
                  console.log(err.message)  
                  reject(err);
                } else {
                  resolve(results);
                }
              }
            );
          });
    }

    insert() {
        const self = this;

        const products_sql = "INSERT INTO products(name, description) VALUES (?,?)";
        const inventory_sql = "INSERT INTO inventory(product_id, stock) VALUES (?, 0)";

        return new Promise(function (resolve) {
            db.run(products_sql, [self.name, self.description], function (err) {
                if (err) {
                    console.log(err.message);
                }
                self.id = this.lastID;
                db.run(inventory_sql, self.id, function (err) {
                    if (err) {
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
            db.serialize(() => {
                db.run(delete_sql, self.id)
                    .run(insert_sql, self.categories, function () {
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
                if (err) console.log(err.message);
                console.log(`Row(s) updated: ${this.changes}`);
                resolve(self);
            })
        })
    }

    delete() {
        const self = this;

        const delete_product_sql = `DELETE FROM products WHERE id = ?`;
        const delete_category_sql = "DELETE FROM product_to_category WHERE product_id = ?";
        const delete_inventory_sql = "DELETE FROM inventory WHERE product_id = ?"

        return new Promise(function (resolve) {
            db.serialize(()=>{
                db.run(delete_product_sql, [self.id], function (err) {
                    if (err) console.log(err.message);
                    console.log(`Product Row(s) updated: ${this.changes}`);
                })
                .run(delete_category_sql, [self.id], function (err) {
                    if (err) console.log(err.message);
                    console.log(`Category Row(s) updated: ${this.changes}`);
                })
                .run(delete_inventory_sql, [self.id], function (err) {
                    if (err) console.log(err.message);
                    console.log(`Inventory Row(s) updated: ${this.changes}`);
                    resolve(true);
                    console.log("products deleted")
                })
            })
        })
    }

}


module.exports = Product;