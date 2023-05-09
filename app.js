const express = require("express");
const app = express();

const { getAllCategories } = require("./db/controllers/categories.controller");

app.get("/api/categories", getAllCategories)

module.exports = app;
