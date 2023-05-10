const express = require("express");
const app = express();

const { getAllCategories } = require("./db/controllers/categories.controller");
const { getReview } = require("./db/controllers/reviews.controller");

app.get("/api/categories", getAllCategories);

app.get("/api/reviews/:review_id", getReview);

app.get("*", (request, response) => {
  response.status(404).send({ message: "Path Not Found" });
});

app.use((err, request, response, next) => {
  console.log(err);
  response.status(500).send({ message: "Internal Server Error!" });
});

module.exports = app;
