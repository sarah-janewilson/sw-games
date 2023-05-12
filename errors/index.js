exports.handleCustomErrors = (err, request, response, next) => {
  if (err.status && err.message) {
    response.status(err.status).send({ message: err.message });
  } else next(err);
};

exports.handlePsqlErrors = (err, request, response, next) => {
  if (err.code === "22P02" || err.code === "23502") {
    response.status(400).send({ message: "Bad Request" });
  } else if (err.code === "23503") {
    response.status(404).send({ message: "Review Not Found" });
  } else next(err);
};

exports.handleServerErrors = (err, request, response, next) => {
  response.status(500).send({ message: "Internal Server Error" });
};
