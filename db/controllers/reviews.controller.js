const { fetchReviews, patchVotesByReviewId } = require("../models/reviews.model");
const { fetchReviewById } = require("../models/reviews.model");

exports.getAllReviews = (request, response, next) => {
  fetchReviews()
    .then((reviews) => {
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
