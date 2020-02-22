const router = require("express").Router();
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("inventory.db");

router.get("/", (req, res) => {
  new Promise((resolve, reject) => {
    db.all(
      "SELECT products.id, products.name, inventory.stock FROM products JOIN inventory ON products.id = inventory.product_id",
      function(err, results) {
        if (err) {
          console.error(err.toString());
          reject(err);
        } else {
          resolve(results);
        }
      }
    );
  }).then(productsFromDb => {
    res.render("inventory", {
      title: "Készletek",
      inventory: true,
      items: productsFromDb
    });
  });
});

router.post("/", (req, res) => {
  const { stock_quantity, stock_item_id } = req.body;
  db.serialize(function() {
    if (stock_item_id !== undefined && stock_quantity !== undefined) {
      db.run(
        `UPDATE inventory SET stock = ${+stock_quantity} WHERE product_id = ${+stock_item_id}`,
        err => {
          if (err != null) {
            console.error(err.toString());
          }
        }
      );
    }
  });

  res.redirect("/inventory");
});

module.exports = router;
