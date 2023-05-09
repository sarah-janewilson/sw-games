const app = require("../app.js");
const request = require("supertest");
const db = require("../db/connection.js");

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

describe("/api/reviews/:review_id", () => {
  test("GET /api/reviews/:review_id responds with status 200", () => {
    return request(app).get("/api/reviews/1").expect(200);
  });
  test("Get /api/reviews/:review_id responds with an object with the required properties", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("review_id");
        expect(response.body).toHaveProperty("title");
        expect(response.body).toHaveProperty("review_body");
        expect(response.body).toHaveProperty("designer");
        expect(response.body).toHaveProperty("review_img_url");
        expect(response.body).toHaveProperty("votes");
        expect(response.body).toHaveProperty("category");
        expect(response.body).toHaveProperty("owner");
        expect(response.body).toHaveProperty("created_at");
      });
  });
  test("GET /api/reviews/:review_id responds with an object with properties which are of the correct data type", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then((response) => {
        expect(typeof response.body.review_id).toBe("number");
        expect(typeof response.body.title).toBe("string");
        expect(typeof response.body.review_body).toBe("string");
        expect(typeof response.body.designer).toBe("string");
        expect(typeof response.body.review_img_url).toBe("string");
        expect(typeof response.body.votes).toBe("number");
        expect(typeof response.body.category).toBe("string");
        expect(typeof response.body.owner).toBe("string");
        expect(typeof response.body.created_at).toBe("string");
      });
  });
});
