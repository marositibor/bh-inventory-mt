const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('inventory.db')
 
function database(namepm, categorypm){
    db.serialize(function() {
        db.run("CREATE TABLE products ( name VARCHAR(100), category VARCHAR(60))")
     
        db.prepare('INSERT INTO products VALUES (?, ?)')
            .run(`${namepm}`, `${categorypm}`)
    
    
    });
}

database("vasalo", "haztartas")