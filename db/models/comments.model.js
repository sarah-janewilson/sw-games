const db = require("../../db/connection");

exports.fetchCommentsByReviewId = (fetchedComments) => {
  return db
    .query(
      `SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC;`,
      [fetchedComments.review_id]
    )
    .then((response) => {
        if (!response.rows.length) {
            return Promise.reject({ status: 404, message: "Path Not Found" });
          }
      return response.rows;
    });
};
