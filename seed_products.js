const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database("inventory.db");

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
  { name: "Monitor", category: 1 },
  { name: "Billetyűzet", category: 1 },
  { name: "Fürdőkád", category: 2 },
  { name: "Egér", category: 1 },
  { name: "Radiátor", category: 3 },
  { name: "Kazán", category: 3 },
  { name: "Kandalló", category: 3 },
  { name: "Redőny", category: 4 },
  { name: "Ajtó", category: 4 },
  { name: "Csavarhúzó", category: 1 }
];

db.serialize(function() {
  adjectives.forEach(adj => {
    pronouns.forEach(pro => {
      db.run(
        `INSERT INTO products(name, description) VALUES ('${adj} ${pro.name}', '')`
      );
      db.get(
        `SELECT id FROM products WHERE name = '${adj} ${pro.name}'`,
        (err, result) => {
          if (err != null) {
            console.error(err.toString());
          }
          db.run(
            `INSERT INTO inventory(product_id, stock) VALUES (${result.id}, 0)`,
            err => {
              if (err != null) {
                console.error(err.toString());
              }
            }
          );
          db.run(
            `INSERT INTO product_to_category(product_id, category_id) VALUES (${result.id}, ${pro.category})`,
            err => {
              if (err != null) {
                console.error(err.toString());
              }
            }
          );
        }
      );
    });
  });
});
