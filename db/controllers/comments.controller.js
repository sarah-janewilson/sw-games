const { fetchCommentsByReviewId } = require("../models/comments.model");

exports.getAllCommentsByReviewId = (request, response, next) => {
  const reviewToFetch = request.params;
  fetchCommentsByReviewId(reviewToFetch)
    .then((fetchedComments) => {
      response.status(200).send(fetchedComments);
    })
    .catch(next);
};
