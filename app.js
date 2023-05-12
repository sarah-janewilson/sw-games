const express = require("express");
const app = express();
app.use(express.json());

const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index.js");
const { getAllCategories } = require("./db/controllers/categories.controller");
const { readMeFunc } = require("./db/controllers/api.controller");
const {
  getAllReviews,
  getReviewById,
  updateVotesByReviewId,
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

app.post("/api/reviews/:review_id/comments", (request, response, next) => {
  postNewComment(request, response, next);
});

app.patch("/api/reviews/:review_id", (request, response, next) => {
  updateVotesByReviewId(request, response, next);
});

app.get("*", (request, response, next) => {
  response.status(404).send({ message: "Path Not Found" });
});

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
