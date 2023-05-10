const db = require("../../db/connection");

exports.fetchReviews = () => {
  return db
    .query(
      `SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer, COUNT(comments.review_id)::INT as comment_count FROM reviews LEFT JOIN comments ON reviews.review_id = comments.review_id GROUP BY reviews.review_id ORDER BY reviews.created_at DESC;`
    )
    .then((response) => {
      if (response.rows.length === 0) {
        return Promise.reject({ status: 404, message: "Path Not Found" });
      }
      return response.rows;
    });
};
