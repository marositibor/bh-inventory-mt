const router = require("express").Router();
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("inventory.db");
const Product = require("../models/Product");

router.get("/", (req, res) => {
  const productsList = new Promise((resolve, reject) => {
    db.all(
      "SELECT  products.id as id, products.name as name, group_concat(categories.name) as category, group_concat(categories.id) as category_id, products.description FROM products LEFT JOIN product_to_category ON product_to_category.product_id = products.id LEFT JOIN categories ON product_to_category.category_id = categories.id GROUP BY products.id",
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

  const newProduct = new Product("",product_name,product_cat,product_desc);

  newProduct.insert()
  .then(resolution => resolution.insertCategories()
  .then(res.redirect("/products")))

});

router.post("/:id", (req, res) => {
  const product_id = req.params.id;
  const { product_name, product_cat, product_desc } = req.body;

  const productToUpdate = new Product(+product_id,product_name,product_cat,product_desc); 

  productToUpdate.update()
  .then(resolution => resolution.insertCategories()
  .then(res.redirect("/products")))
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
    res.redirect(303,"/products");
  });
});

module.exports = router;
