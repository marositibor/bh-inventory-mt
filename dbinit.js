const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('inventory.db')
 
db.serialize(function() {
    db.run("CREATE TABLE products (name VARCHAR(100), category VARCHAR(60))")
 
    db.prepare('INSERT INTO products VALUES (?, ?)')
        .run('Processzor', 'Számítástechnika')

    db.prepare('INSERT INTO products VALUES (?, ?)')
        .run('Memória', 'Számítástechnika')

    db.prepare('INSERT INTO products VALUES (?, ?)')
        .run('Billentyűzet', 'Számítástechnika')

    db.prepare('INSERT INTO products VALUES (?, ?)')
        .run('Mosogatógép', 'Konyhatechnika')

    db.prepare('INSERT INTO products VALUES (?, ?)')
        .run('Elektromos radiátor', 'Fűtéstechnika')

    db.prepare('INSERT INTO products VALUES (?, ?)')
        .run('Egér', 'Számítástechnika')

});
 