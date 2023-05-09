const express = require("express");
const app = express();

const { getAllCategories } = require("./db/controllers/categories.controller");

app.get("/api/categories", getAllCategories);

app.get("/api/*", (request, response, next) => {
  response.status(404).send({ message: "Path Not Found" });
});

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send({ message: "Internal Server Error!" });
});

module.exports = app;
