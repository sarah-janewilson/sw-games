const { createComment } = require("../models/comments.model");
const { fetchCommentsByReviewId } = require("../models/comments.model");

exports.getAllCommentsByReviewId = (request, response, next) => {
  const reviewToFetch = request.params;
  fetchCommentsByReviewId(reviewToFetch)
    .then((fetchedComments) => {
      response.status(200).send(fetchedComments);
    })
    .catch(next);
};

exports.postNewComment = (request, response, next) => {
  const { username, body } = request.body;
  const reviewId = request.params.review_id;
  if (!username || !body) {
    return response
      .status(400)
      .send({ message: "Bad Request - Missing Required Fields" });
  }
  createComment(username, body, reviewId)
    .then((createdComment) => {
      response.status(201).send(createdComment);
    })
    .catch(next);
};
