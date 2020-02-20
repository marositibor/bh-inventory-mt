const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');


const db = new sqlite3.Database('inventory.db')
const PORT = 3000;
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

/*app.get('/', (req, res) => {
	res.render('home', { items});
});*/

app.get('/products', (req, res) => {
    db.serialize(function() {
        db.all("SELECT rowid, name, category from products", function(err, results) {
            if (err != null) {
                res.send("Missing from database")
            }
          res.render('products', {
            items:results,
            products:true,
            title:"Termékek"})
        });
      });
})

app.get('/inventory', (req, res) => {
    db.serialize(function() {
        db.all("SELECT rowid, name, category from products", function(err, results) {
            if (err != null) {
                res.send("Missing from database")
            }
          res.render('inventory', {
            items:results,
            inventory:true,
            title:"Készletek"})
        });
      });
})

app.post('/products', (req,res) => {
    const {name,category} = req.body;
    db.serialize(function() {
        db.prepare('INSERT INTO products VALUES (?, ?)')
        .run(name, category)
        res.redirect('/products')
      });
})

app.listen(PORT, () => console.log(`App is started and listening on port ${PORT}`));
