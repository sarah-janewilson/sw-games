const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");
const fs = require("fs");

const seed = require("../db/seeds/seed.js");
const testData = require("../db/data/test-data");

beforeEach(() => seed(testData));
afterAll(() => db.end());

describe("app error testing", () => {
  test("GET request responds with status code 404 and error message when passed a non-existent endpoint", () => {
    return request(app)
      .get("/api/nonsense")
      .expect(404)
      .then((result) => {
        expect(result.body.message).toBe("Path Not Found");
      });
  });
});

describe("/api/categories", () => {
  test("GET request responds with status 200 and an array of category objects", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((result) => {
        expect(result.body.length).toBe(4);
      });
  });
  test("GET request responds with array of category objects with correct keys", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((result) => {
        result.body.forEach((category) => {
          expect(typeof category.slug).toBe("string");
          expect(typeof category.description).toBe("string");
        });
      });
  });
});

describe("/api", () => {
  test("GET request responds with status 200 and a JSON object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
  });
});
test("GET request responds with accurate JSON object", () => {
  return request(app)
    .get("/api")
    .expect(200)
    .then((result) => {
        expect(result.body).toEqual(JSON.parse(fs.readFileSync("./endpoints.json")))
    })
});
