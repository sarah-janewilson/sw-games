const db = require("../../db/connection");

exports.fetchReview = (fetchedReview) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [
      fetchedReview.review_id,
    ])
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({ status: 404, message: "Review Not Found" });
      }
      return response.rows[0];
    });
};
