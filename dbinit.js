const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('inventory.db')

db.serialize(function () {
    
    db.run("CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100) NOT NULL)");
    
    db.run("INSERT INTO categories(name) VALUES ('Számítástechnika')");
    db.run("INSERT INTO categories(name) VALUES ('Konyhatechnika')");
    db.run("INSERT INTO categories(name) VALUES ('Fűtéstechnika')");
    db.run("INSERT INTO categories(name) VALUES ('Árnyékolástechnika')");
    
    db.run("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100) NOT NULL, category_id INTEGER NOT NULL, description TEXT, FOREIGN KEY (category_id) REFERENCES categories (id))");

    db.run("INSERT INTO products(name, category_id, description) VALUES ('Vezeték nélküli egér', 1, '')");
    db.run("INSERT INTO products(name, category_id, description) VALUES  ('Winchester', 1, '')");
    db.run("INSERT INTO products(name, category_id, description) VALUES  ('Elektromos radiátor', 3, '')");
    db.run("INSERT INTO products(name, category_id, description) VALUES  ('Gaba monitor', 1, '')");

    db.run("CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY, product_id INTEGER NOT NULL, stock INTEGER NOT NULL, FOREIGN KEY (product_id) REFERENCES products (id))");

    db.run("INSERT INTO inventory(product_id, stock) VALUES (1, 18)");
    db.run("INSERT INTO inventory(product_id, stock) VALUES (2, 13)");
    db.run("INSERT INTO inventory(product_id, stock) VALUES (3, 4)");
    db.run("INSERT INTO inventory(product_id, stock) VALUES (4, 2)");
});