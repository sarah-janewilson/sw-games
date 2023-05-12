const { fetchReviews, patchVotesByReviewId } = require("../models/reviews.model");
const { fetchReviewById } = require("../models/reviews.model");

exports.getAllReviews = (request, response, next) => {
  const { category, sort_by, order } = request.query
  fetchReviews(category, sort_by, order)
    .then((reviews) => {
      if (category && reviews.length === 0) {
        response.status(404).send({ message: "Category Not Found" });
      }
      response.status(200).send(reviews);
    })
    .catch(next);
};

exports.getReviewById = (request, response, next) => {
  const reviewToFetch = request.params;
  fetchReviewById(reviewToFetch)
    .then((fetchedReview) => {
      return response.status(200).send(fetchedReview);
    })
    .catch(next);
};

exports.updateVotesByReviewId = (request, response, next) => {
  const reviewId = request.params.review_id;
  const incVotes = request.body.inc_votes;
  patchVotesByReviewId(incVotes, reviewId)
    .then((updatedReview) => {
      response.status(200).send(updatedReview);
    })
    .catch(next);
};
