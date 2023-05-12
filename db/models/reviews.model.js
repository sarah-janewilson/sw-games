const db = require("../../db/connection");

exports.fetchReviews = () => {
  return db
    .query(
      `SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.review_id)::INT as comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id ORDER BY reviews.created_at DESC;`
    )
    .then((response) => {
      return response.rows;
    });
};

exports.fetchReviewById = (fetchedReview) => {
  return db
    .query(`SELECT * FROM reviews WHERE review_id = $1;`, [
      fetchedReview.review_id,
    ])
    .then((response) => {
      if (!response.rows.length) {
        return Promise.reject({ status: 404, message: "Review Not Found" });
      }
      return response.rows[0];
    });
};

exports.patchVotesByReviewId = (incVotes, reviewId) => {
  return db
    .query(
      `UPDATE reviews
  SET votes = votes + $1
  WHERE review_id = $2
  RETURNING *;`,
      [incVotes, reviewId]
    )
    .then((response) => {
      if (!response.rows[0]) {
        return Promise.reject({ status: 404, message: "Review Not Found" });
      }
      return response.rows[0];
    });
};
