const { fetchReviews } = require("../models/reviews.model");
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
