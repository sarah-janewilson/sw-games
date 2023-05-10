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
      expect(result.body).toEqual(
        JSON.parse(fs.readFileSync("./endpoints.json"))
      );
    });
});

describe("/api/reviews", () => {
  test("GET /api/reviews responds with status 200 and an array of review objects", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((result) => {
        expect(Array.isArray(result.body)).toBe(true);
        expect(result.body.length).toBe(13);
      });
  });
  test("GET /api/reviews responds with an array of review objects with the required properties", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((result) => {
        result.body.forEach((review) => {
          expect(review).toHaveProperty("owner");
          expect(review).toHaveProperty("title");
          expect(review).toHaveProperty("review_id");
          expect(review).toHaveProperty("category");
          expect(review).toHaveProperty("review_img_url");
          expect(review).toHaveProperty("created_at");
          expect(review).toHaveProperty("votes");
          expect(review).toHaveProperty("designer");
          expect(review).toHaveProperty("comment_count");
        });
      });
  });
  test("GET /api/reviews responds with an array of review objects with properties which are of the correct data type", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((result) => {
        result.body.forEach((review) => {
          expect(typeof review.owner).toBe("string");
          expect(typeof review.title).toBe("string");
          expect(typeof review.review_id).toBe("number");
          expect(typeof review.category).toBe("string");
          expect(typeof review.review_img_url).toBe("string");
          expect(typeof review.created_at).toBe("string");
          expect(typeof review.votes).toBe("number");
          expect(typeof review.designer).toBe("string");
          expect(typeof review.comment_count).toBe("number");
        });
      });
  });
  test("GET /api/reviews responds with array of all review objects sorted by date in descending order by default", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((result) => {
        expect(result.body).toBeSortedBy("created_at", { descending: true });
      });
  });
});
test("there should not be a review_body property present on any of the review objects", () => {
  return request(app)
    .get("/api/reviews")
    .expect(200)
    .then((result) => {
      result.body.forEach((review) => {
        expect(review).not.toHaveProperty("review_body");
      });
    });
});
test("GET /api/reviews responds with status 404 and error message if endpoint is incorrect", () => {
  return request(app)
    .get("/api/reviewsss")
    .expect(404)
    .then((result) => {
      expect(result.body.message).toBe("Path Not Found");
    });
});