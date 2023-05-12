const devData = require("../data/development-data/index.js");
const seed = require("./seed.js");
const db = require("../connection.js");

seed(devData).then(() => {
  console.log(
    `Database ${process.env.PGDATABASE || process.env.DATABASE_URL} seeded`
  );
  return db.end();
});
