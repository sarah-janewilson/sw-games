const express = require("express");
const app = express();
app.use(express.json());

const { getAllCategories } = require("./db/controllers/categories.controller");
const { readMeFunc } = require("./db/controllers/api.controller");
const {
  getAllReviews,
  getReviewById,
} = require("./db/controllers/reviews.controller");
const {
  getAllCommentsByReviewId,
  postNewComment,
} = require("./db/controllers/comments.controller");

app.get("/api/categories", getAllCategories);
app.get("/api", readMeFunc);
app.get("/api/reviews", getAllReviews);
app.get("/api/reviews/:review_id", getReviewById);
app.get("/api/reviews/:review_id/comments", getAllCommentsByReviewId);

app.post("/api/reviews/:review_id/comments", (request, response) => {
  postNewComment(request, response);
});

app.get("*", (request, response, next) => {
  response.status(404).send({ message: "Path Not Found" });
});

app.use((err, request, response, next) => {
  if (err.status && err.message) {
    response.status(err.status).send({ message: err.message });
  } else if (err.code === "22P02") {
    response.status(400).send({ message: "Invalid Review ID" });
  } else response.status(500).send({ message: "Internal Server Error" });
});

module.exports = app;
