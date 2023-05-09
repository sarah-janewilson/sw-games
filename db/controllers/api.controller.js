const fs = require("fs");

exports.readMeFunc = (request, response) => {
    const endpoints = JSON.parse(fs.readFileSync("./endpoints.json"));
    response.status(200).send(endpoints);
  }
