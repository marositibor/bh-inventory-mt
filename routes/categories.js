const router = require("express").Router();
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("inventory.db");

router.get("/", (req, res) => {
  db.serialize(function() {
    db.all("SELECT id, name FROM categories", function(err, results) {
      if (err != null) {
        console.error(err.toString());
      }

      res.render("categories", {
        title: "Készletek",
        categories: true,
        items: results
      });
    });
  });
});

router.post("/", (req, res) => {
  const { category_name } = req.body;
  db.serialize(function() {
    if (category_name !== undefined) {
      db.run(`INSERT INTO categories(name) VALUES('${category_name}')`, err => {
        if (err != null) {
          console.error(err.toString());
        }
      });
    }
  });
  res.redirect("/categories");
});

router.post("/:id", (req, res) => {
    const category_id = req.params.id;
    const { category_name } = req.body;
  
    db.serialize(function() {
      if (
        category_id !== undefined &&
        category_name !== undefined
      ) {
        db.run(
          `UPDATE categories SET name="${category_name}" WHERE id = ${+category_id}`,
          err => {
            if (err != null) {
              console.error(err.toString());
            }
          }
        );
      }
      res.redirect("/categories");
    });
  });

  router.delete("/:id", (req,res) => {
    const category_id = req.params.id;

    db.serialize(function() {
      if (category_id !== undefined) {
        db.run(`DELETE FROM categories WHERE id = ${+category_id}`, err => {
          if (err != null) {
            console.error(err.toString());
          }
        });
        db.run(`DELETE FROM product_to_category WHERE category_id = ${+category_id}`, err => {
          if (err != null) {
            console.error(err.toString());
          }
        });
      } 
      res.redirect(303,"/categories");
    });
  });

module.exports = router;
