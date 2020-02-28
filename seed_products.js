const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('inventory.db')

let adjectives = [
    "Elektromos",
    "Fehér",
    "Négylábú",
    "Magyar",
    "Használt",
    "Mechanikus",
    "Kvantum",
    "Kondenzációs",
    "Fa",
    "Vezeték nélküli"
];

let pronouns = [
    "Monitor",
    "Billetyűzet",
    "Fürdőkád",
    "Egér",
    "Radiátor",
    "Kazán",
    "Kandalló",
    "Redőny",
    "Ajtó",
    "Csavarhúzó"
];





db.serialize(function () {
    

    adjectives.forEach(adj => {
        pronouns.forEach(pro => {
            db.run(`INSERT INTO products(name, description) VALUES ('${adj} ${pro}', '')`);
        });
    });

});