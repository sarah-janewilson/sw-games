const { fetchUsers } = require("../models/users.model");

exports.getAllUsers = (request, response, next) => {
    fetchUsers()
      .then((users) => {
        response.status(200).send(users);
      })
      .catch(next);
  };