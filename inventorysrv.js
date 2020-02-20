const express = require('express');
const path = require('path');
const hbs = require('express-handlebars');
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('inventory.db')
const PORT = 3000;
const app = express();
app.engine('handlebars', hbs());
app.set('view engine', 'handlebars');

const items = [];

app.use(express.static(path.join(__dirname, 'public')));

/*app.get('/', (req, res) => {
	res.render('home', { items});
});*/

app.get('/', (req, res) => {
    db.serialize(function() {
        db.all("SELECT rowid, name, category from products", function(err, results) {
            if (err != null) {
                res.send("Missing from database")
            }
			items.push(results)
			console.log(results)
          res.render('home', {items:results})
            
        });
      });

})

app.listen(PORT, () => console.log(`App is started and listening on port ${PORT}`));
