const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("inventory.db");

class Category {
    constructor(name) {
        this.name = name;
    }

    static getAllCategories() {
        return new Promise((resolve, reject) => {
            db.all("SELECT id,name from categories", function(err, results) {
              if (err) {
                console.log(err.message)
                reject(err);
              } else {
                resolve(results);
              }
            });
          }); 
    }

    insert() {

        const self = this;

        const category_sql = "INSERT INTO category(name) VALUES (?)";

        return new Promise(function (resolve) {
            db.run(category_sql, [self.name], function () {
                self.id = this.lastID;
                resolve(self)
            })
        })

    }
}

module.exports = Category;