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

exports.createComment = (username, body, reviewId) => {
  return db
    .query(
      `INSERT INTO comments (review_id, author, body)
      VALUES ($1, $2, $3)
      RETURNING*;`,
      [reviewId, username, body]
    )
    .then((result) => {
      const comment = { ...result.rows[0] };
      delete comment.author;
      comment.username = result.rows[0].author;
      return comment;
    });
};
