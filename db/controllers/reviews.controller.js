const { fetchReview } = require("../models/reviews.model");

exports.getReview = (request, response, next) => {
  const reviewToFetch = request.params;
  fetchReview(reviewToFetch)
    .then((fetchedReview) => {
      return response.status(200).send(fetchedReview);
    })
    .catch(next);
};
