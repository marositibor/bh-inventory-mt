const router = require("express").Router();
const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("inventory.db");
const Product = require("../models/Product");
const Category = require("../models/Category");

router.get("/", (req, res) => {

  const {product_cat = 0, sort_by="id", sort_order="ASC", page = 1} = req.query;
  const productsList = Product.getAllProducts(product_cat,sort_by,sort_order,page);
  const categoriesList = Category.getAllCategories();

  let products_count = 0;
  Product.getProductsCount()
  .then(resolution => products_count = resolution)
  .then(() => {
    const pages_count = Math.floor(products_count/30)+1;
    const pages_array = []
    for (let i = 1; i <= pages_count; i++){
      pages_array.push({ 
        pageNumber: i,
        isCurrentPage: page == i
      });
    }
    Promise.all([productsList, categoriesList]).then(data => {
      res.render("products", {
        items: data[0],
        category: data[1],
        products: true,
        title: "Termékek",
        category_filter: +product_cat,
        sort_asc: sort_order === "ASC",
        sort_id: sort_by === "id",
        sort_name: sort_by === "name",
        sort_category: sort_by === "category",
        pages: pages_array,
        currentPage: page,
        prevPage: +page-1,
        nextPage: +page+1,
        isLastPage: page == pages_array.length,
      });
    });
  })
  
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
