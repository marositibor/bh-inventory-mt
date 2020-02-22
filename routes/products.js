const router = require("express").Router();
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("inventory.db");

router.get("/", (req, res) => {
  const productsList = new Promise((resolve, reject) => {
    db.all(
      "SELECT products.id as id, products.name as name, categories.name as category, products.description, products.category_id from products, categories WHERE products.category_id = categories.id",
      function(err, results) {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  });

  const categoriesList = new Promise((resolve, reject) => {
    db.all("SELECT id,name from categories", function(err, results) {
      if (err) {
        reject(err);
      } else {
        resolve(results);
      }
    });
  });

  Promise.all([productsList,categoriesList]).then(lists => {
    res.render("products", {
        items: lists[0],
        category: lists[1],
        products: true,
        title: "Termékek"
      });
  })



});

router.post("/", (req, res) => {
  const { product_name, product_cat, product_desc } = req.body;
  if (product_name && product_cat) {
    db.serialize(function() {
      db.run(
        `INSERT INTO products(name, category_id, description) VALUES ("${product_name}", ${+product_cat}, "${product_desc}")`,
        err => {
          if (err != null) {
            console.error(err.toString());
          }
        }
      );

      db.get(
        `SELECT id FROM products WHERE name = "${product_name}" AND category_id = ${+product_cat}`,
        (err, result) => {
          if (err != null) {
            console.error(err.toString());
          }

          db.run(
            `INSERT INTO inventory(product_id, stock) VALUES (${result.id}, 0)`,
            err => {
              if (err != null) {
                console.error(err.toString());
              }
            }
          );
          res.redirect("/products");
        }
      );
    });
  }
});

router.post("/:id", (req, res) => {
  const product_id = req.params.id;
  const { product_name, product_cat, product_desc } = req.body;

  db.serialize(function() {
    if (
      product_id !== undefined &&
      product_name !== undefined &&
      product_cat !== undefined
    ) {
      db.run(
        `UPDATE products SET category_id = ${+product_cat}, name="${product_name}", description="${product_desc}" WHERE id = ${+product_id}`,
        err => {
          if (err != null) {
            console.error(err.toString());
          }
        }
      );
    }
    res.redirect("/products");
  });
});

router.delete("/:id", (req, res) => {
  const product_id = req.params.id;

  db.serialize(function() {
    if (product_id !== undefined) {
      db.run(`DELETE FROM products WHERE id = ${+product_id}`, err => {
        if (err != null) {
          console.error(err.toString());
        }
      });
    }
    res.redirect("/products");
  });
});

module.exports = router;
