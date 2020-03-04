const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');

const productsRouter = require('./routes/products');
const inventoryRouter = require('./routes/inventory');
const categoriesRouter = require('./routes/categories');


const db = new sqlite3.Database('inventory.db')
const PORT = 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));


app.use('/products', productsRouter);

app.use('/inventory', inventoryRouter);

app.use('/categories', categoriesRouter);

app.get('/', (req, res) => {
  res.redirect('/products')
})

app.listen(PORT, () => console.log(`App is started and listening on port ${PORT}`));
