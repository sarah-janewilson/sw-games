const { fetchReview } = require("../models/reviews.model");

exports.getReview = (request, response, next) => {
  const reviewToFetch = request.params;
  if (reviewToFetch.review_id.match(/([0-9])+/)) {
    fetchReview(reviewToFetch)
      .then((fetchedReview) => {
        response.status(200).send(fetchedReview);
      })
      .catch((err) => {
        if (err.status && err.message) {
          response.status(err.status).send({ message: err.message });
        } else next(err);
      });
  } else response.status(400).send({ message: "Invalid Review ID" });
};
