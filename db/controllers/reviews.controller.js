const { fetchReview } = require("../models/reviews.model");
const { fetchReviews } = require("../models/reviews.model");

exports.getReview = (request, response, next) => {
  const reviewToFetch = request.params;
  fetchReview(reviewToFetch)
    .then((fetchedReview) => {
      return response.status(200).send(fetchedReview);
    })
    .catch(next);
};

exports.getAllReviews = (request, response, next) => {
  fetchReviews()
    .then((reviews) => {
      response.status(200).send(reviews);
    })
    .catch((err) => {
      next(err);
    });
};
