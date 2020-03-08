const router = require("express").Router();
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("inventory.db");

const Category = require("../models/Category");

router.get("/", (req, res) => {
  Category.getAllCategories().then(resolution => {
    res.render("categories", {
      title: "Készletek",
      categories: true,
      items: resolution
    });
  });
});

router.post("/", (req, res) => {
  const { category_name } = req.body;
  const categoryToInsert = new Category(0, category_name);
  categoryToInsert.insert().then(() => {
    res.redirect("/categories");
  });
});

router.post("/:id", (req, res) => {
  const category_id = req.params.id;
  const { category_name } = req.body;
  const categoryToUpdate = new Category(category_id,category_name);

  categoryToUpdate.update().then(()=>{
    res.redirect("/categories");
  })
});

router.delete("/:id", (req, res) => {
  const category_id = req.params.id;

  const categoryToDelete = new Category(category_id);
  categoryToDelete.delete().then(() => {
    res.redirect(303, "/categories");
  });
});

module.exports = router;
