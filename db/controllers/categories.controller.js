const { fetchCategories } = require("../models/categories.model");

exports.getAllCategories = (request, response, next) => {
  fetchCategories()
    .then((categories) => {
      response.status(200).send(categories);
    })
    .catch((err) => {
      next(err);
    });
};
