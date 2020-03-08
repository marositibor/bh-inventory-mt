const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("inventory.db");

class Category {
  constructor(id,name) {
    this.id = id || null;
    this.name = name || "";
  }

  static getAllCategories() {
    return new Promise((resolve, reject) => {
      db.all("SELECT id,name from categories", function(err, results) {
        if (err) {
          console.log(err.message);
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  }

  update() {
    const self = this;
    const sql = `UPDATE categories SET name= ? WHERE id = ?`;
    return new Promise(function(resolve) {
      db.run(sql,[self.name,self.id],function(err){
        if(err) console.log(err.message);
        resolve(true);
      })
    })
  }

  insert() {
    const self = this;
    const category_sql = "INSERT INTO categories(name) VALUES (?)";
    return new Promise(function(resolve) {
      db.run(category_sql, [self.name], function(err) {
        if (err) console.log(err.message);
        self.id = this.lastID;
        resolve(self);
      });
    });
  }

  delete() {
    const self = this;
    const delete_category_sql = `DELETE FROM categories where id = ?`
    const delete_categoryproducts_sql = `DELETE FROM product_to_category WHERE category_id = ?`;
    return new Promise((resolve) => {
      db.serialize(()=>{
        db.run(delete_category_sql,self.id,function(err){
          if(err) console.log(err.message);
        })
        .run(delete_categoryproducts_sql,self.id,function(err){
          if(err) console.log(err.message);
          resolve(true);
        })
      })
    })
  }
}

module.exports = Category;
