const { fetchReviews } = require("../models/reviews.model");

exports.getAllReviews = (request, response, next) => {
  fetchReviews()
    .then((reviews) => {
      response.status(200).send(reviews);
    })
    .catch((err) => {
      next(err);
    });
};
