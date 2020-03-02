const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("inventory.db");

class Category {
    constructor(name) {
        this.name = name;
    }

    insert() {

        const self = this;

        const category_sql = "INSERT INTO products(name, description) VALUES (?,?)";

        return new Promise(function (resolve) {
            db.run(category_sql, [self.name], function () {
                self.id = this.lastID;
                resolve(self)
            })
        })

    }
}