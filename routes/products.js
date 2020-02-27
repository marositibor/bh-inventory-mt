const router = require("express").Router();
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("inventory.db");

router.get("/", (req, res) => {
  const productsList = new Promise((resolve, reject) => {
    db.all(
      "SELECT  products.id as id, products.name as name, group_concat(categories.name) as category, group_concat(categories.id) as category_id, products.description FROM product_to_category INNER JOIN products ON product_to_category.product_id = products.id INNER JOIN categories ON product_to_category.category_id = categories.id GROUP BY products.id",
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

  Promise.all([productsList, categoriesList]).then(lists => {
    res.render("products", {
      items: lists[0],
      category: lists[1],
      products: true,
      title: "Termékek"
    });
  });
});

router.post("/", (req, res) => {
  const { product_name, product_cat, product_desc } = req.body;

  if (product_name && product_cat) {
    db.serialize(function() {
      db.run(
        `INSERT INTO products(name, description) VALUES ("${product_name}", "${product_desc}")`,
        err => {
          if (err != null) {
            console.error(err.toString());
          }
        }
      );

      db.get(
        `SELECT id FROM products WHERE name = "${product_name}"`,
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
          
          if(Array.isArray(product_cat)) {
            product_cat.forEach(id => {
              db.run(
                `INSERT INTO product_to_category(product_id, category_id) VALUES (${+result.id}, ${+id})`,
                err => {
                  if (err != null) {
                    console.error(err.toString());
                  }
                }
              );
            });
          } else {
            db.run(
              `INSERT INTO product_to_category(product_id, category_id) VALUES (${+result.id}, ${+product_cat})`,
              err => {
                if (err != null) {
                  console.error(err.toString());
                }
              }
            );
          }


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
        `UPDATE products SET name="${product_name}", description="${product_desc}" WHERE id = ${+product_id}`,
        err => {
          if (err != null) {
            console.error(err.toString());
          }
        }
      );
      db.run(
        `DELETE FROM product_to_category WHERE product_id = ${+product_id}`,
        err => {
          if (err != null) {
            console.error(err.toString());
          }
        }
      );
      if(Array.isArray(product_cat)) {
        product_cat.forEach(id => {
          db.run(
            `INSERT INTO product_to_category(product_id, category_id) VALUES (${+product_id}, ${+id})`,
            err => {
              if (err != null) {
                console.error(err.toString());
              }
            }
          );
        });
      } else {
        db.run(
          `INSERT INTO product_to_category(product_id, category_id) VALUES (${+product_id}, ${+product_cat})`,
          err => {
            if (err != null) {
              console.error(err.toString());
            }
          }
        );
      }
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
