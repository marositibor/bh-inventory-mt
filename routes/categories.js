const router = require("express").Router();
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("inventory.db");

router.get("/", (req, res) => {
  db.serialize(function() {
    db.all(
      "SELECT id, name FROM categories",
      function(err, results) {
        if (err != null) {
          console.error(err.toString());
        }

        res.render("categories", {
          title: "Készletek",
          categories: true,
          items: results
        });
      }
    );
  });
});

router.post("/", (req, res) => {
  const { category_name } = req.body;
  db.serialize(function() {
    if (category_name !== undefined) {
      db.run(
        `INSERT INTO categories(name) VALUES('${category_name}')`,
        err => {
          if (err != null) {
            console.error(err.toString());
          }
        }
      );
    }
  });
  res.redirect("/categories");
});

module.exports = router;
