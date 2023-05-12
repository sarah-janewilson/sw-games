const db = require("../../db/connection");

exports.fetchReviews = (category, sort_by = "created_at", order = "DESC") => {
  const sortQueries = ["votes", "created_at", "designer", "owner", "category"];
  if (!sortQueries.includes(sort_by)) {
    return Promise.reject({ status: 400, message: "Invalid Sort Query" });
  }
  const capitalisedOrder = order.toUpperCase();
  const orderQueries = ["ASC", "DESC"];
  if (!orderQueries.includes(capitalisedOrder)) {
    return Promise.reject({ status: 400, message: "Invalid Order Query" });
  }
  let query = `SELECT owner, title, reviews.review_id, category, review_img_url, reviews.created_at, reviews.votes, designer,
  COUNT(comments.review_id)::INT as comment_count
  FROM reviews
  LEFT JOIN comments
  ON reviews.review_id = comments.review_id`;
  let queryValues = [];
  if (category) {
    query += ` WHERE category = $1`;
    queryValues.push(category);
  }
  query += ` GROUP BY reviews.review_id`;
  if (sort_by) {
    query += ` ORDER BY ${sort_by}`;
  }
  if (order) {
    query += ` ${capitalisedOrder}`;
  } else {
    query += ` ORDER BY reviews.created_at DESC`;
  }
  return db.query(query, queryValues).then((response) => {
    return response.rows;
  });
};

exports.fetchReviewById = (fetchedReview) => {
  return db
    .query(
      `SELECT * FROM reviews
    WHERE review_id = $1;`,
      [fetchedReview.review_id]
    )
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
