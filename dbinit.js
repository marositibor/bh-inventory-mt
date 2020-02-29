const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('inventory.db')

db.serialize(function () {
    
    db.run("CREATE TABLE IF NOT EXISTS categories (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100) NOT NULL)");
    
    db.run("INSERT INTO categories(name) VALUES ('Számítástechnika')");
    db.run("INSERT INTO categories(name) VALUES ('Konyhatechnika')");
    db.run("INSERT INTO categories(name) VALUES ('Fűtéstechnika')");
    db.run("INSERT INTO categories(name) VALUES ('Árnyékolástechnika')");
    
    db.run("CREATE TABLE IF NOT EXISTS products (id INTEGER PRIMARY KEY AUTOINCREMENT, name VARCHAR(100) NOT NULL, description TEXT)");

    db.run("CREATE TABLE IF NOT EXISTS inventory (id INTEGER PRIMARY KEY, product_id INTEGER NOT NULL, stock INTEGER NOT NULL, FOREIGN KEY (product_id) REFERENCES products (id))");

    db.run("CREATE TABLE IF NOT EXISTS product_to_category (id INTEGER PRIMARY KEY AUTOINCREMENT, product_id INTEGER NOT NULL, category_id INTEGER NOT NULL, FOREIGN KEY (category_id) REFERENCES categories (id), FOREIGN KEY (product_id) REFERENCES products (id))");
    
    db.run("INSERT INTO product_to_category(product_id, category_id) VALUES (1, 1)");
    db.run("INSERT INTO product_to_category(product_id, category_id) VALUES (2, 1)");
    db.run("INSERT INTO product_to_category(product_id, category_id) VALUES (3, 3)");
    db.run("INSERT INTO product_to_category(product_id, category_id) VALUES (4, 1)");

});