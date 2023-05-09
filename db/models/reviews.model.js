const db = require("../../db/connection");

exports.fetchReview = (fetchedReview) => {
  return db.query(`SELECT * FROM reviews WHERE review_id = $1;`, [fetchedReview.review_id]).then((response) => {
    return response.rows[0];
  });
};
