const router = require("express").Router();
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("inventory.db");
const Product = require("../models/Product");
const Category = require("../models/Category");

router.get("/", (req, res) => {
  const {product_cat} = req.query;
  const productsList = Product.getAllProducts(product_cat);
  const categoriesList = Category.getAllCategories();

  Promise.all([productsList, categoriesList]).then(lists => {

    res.render("products", {
      items: lists[0],
      category: lists[1],
      products: true,
      title: "Termékek",
      category_filter: +product_cat
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
  const productToDelete = new Product(+product_id);
  
  productToDelete.delete().then(res.redirect(303,"/products")) 
  
});

module.exports = router;
