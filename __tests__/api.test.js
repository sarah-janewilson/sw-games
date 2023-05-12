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

describe("GET /api", () => {
  test("GET request responds with status 200 and a JSON object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .expect("Content-Type", "application/json; charset=utf-8");
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
});

describe("GET /api/categories", () => {
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

describe("GET /api/reviews", () => {
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
});

describe("GET /api/reviews QUERIES", () => {
  test("GET /api/reviews responds with status 200 and an array of all review objects filtered by category specified in the query", () => {
    return request(app)
      .get("/api/reviews?category=dexterity")
      .expect(200)
      .then((result) => {
        expect(Array.isArray(result.body)).toBe(true);
        expect(result.body.length).toBe(1);
        result.body.forEach((review) => {
          expect(review.category).toBe("dexterity");
        });
      });
  });
  test("GET /api/reviews responds with status 200 and an array of all review objects when category query is left blank", () => {
    return request(app)
      .get("/api/reviews?category=")
      .expect(200)
      .then((result) => {
        expect(Array.isArray(result.body)).toBe(true);
        expect(result.body.length).toBe(13);
      });
  });
  test("GET /api/reviews responds with status 200 and an array of review object sorted by any valid column, defaulting to descending order", () => {
    return request(app)
      .get("/api/reviews?sort_by=votes")
      .expect(200)
      .then((result) => {
        expect(result.body).toBeSortedBy("votes", { descending: true });
      });
  });
  test("GET /api/reviews responds with status 200 and an array of review object sorted by default as date, and can be in ascending order if specified", () => {
    return request(app)
      .get("/api/reviews?order=asc")
      .expect(200)
      .then((result) => {
        expect(result.body).toBeSortedBy("created_at", { ascending: true });
      });
  });
  test("GET /api/reviews responds with status 200 and an array of review object sorted by any valid column, and can be in ascending order if specified", () => {
    return request(app)
      .get("/api/reviews?sort_by=designer&order=asc")
      .expect(200)
      .then((result) => {
        expect(result.body).toBeSortedBy("designer", { ascending: true });
      });
  });
  test("GET /api/reviews responds with status 400 and an error message when trying to sort by an invalid column", () => {
    return request(app)
      .get("/api/reviews?sort_by=review_id")
      .expect(400)
      .then((result) => {
        expect(result.body.message).toBe("Invalid Sort Query");
      });
  });
  test("GET /api/reviews responds with status 400 and an error message when trying to order by an invalid value", () => {
    return request(app)
      .get("/api/reviews?sort_by=designer&order=alphabetical")
      .expect(400)
      .then((result) => {
        expect(result.body.message).toBe("Invalid Order Query");
      });
  });
  test("GET /api/reviews responds with status 400 and an error message when SQL injection is attempted with a sort_by query", () => {
    return request(app)
      .get("/api/reviews?sort_by=designer; DROP TABLE reviews;")
      .expect(400)
      .then((result) => {
        expect(result.body.message).toBe("Invalid Sort Query");
      });
  });
  test("GET /api/reviews responds with status 400 and an error message when SQL injection is attempted with an order_by query", () => {
    return request(app)
      .get("/api/reviews?order=ASC; DROP TABLE reviews;")
      .expect(400)
      .then((result) => {
        expect(result.body.message).toBe("Invalid Order Query");
      });
  });
  test("GET /api/reviews responds with status 200 and carries out query, ignoring and preventing the SQL injection that is attempted with a category query", () => {
    return request(app)
      .get("/api/reviews?category=dexterity; DROP TABLE reviews;")
      .expect(404)
      .then((result) => {
        expect(result.body.message).toBe("Category Not Found");
        });
      });
  test("GET /api/reviews responds with status 404 and an empty array when passed a category which is not valid", () => {
    return request(app)
      .get("/api/reviews?category=nonsense")
      .expect(404)
      .then((result) => {
        expect(result.body.message).toBe("Category Not Found");
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
  test("Get /api/reviews/:review_id responds with an object with the required properties", () => {
    return request(app)
      .get("/api/reviews/1")
      .expect(200)
      .then((response) => {
        expect(response.body.review_id).toBe(1);
        expect(response.body.title).toBe("Agricola");
        expect(response.body.review_body).toBe("Farmyard fun!");
        expect(response.body.designer).toBe("Uwe Rosenberg");
        expect(response.body.review_img_url).toBe(
          "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700"
        );
        expect(response.body.votes).toBe(1);
        expect(response.body.category).toBe("euro game");
        expect(response.body.owner).toBe("mallionaire");
        expect(response.body.created_at).toBe("2021-01-18T10:00:20.514Z");
      });
  });
  test("GET /api/reviews/review_id responds with status 400 and error message if endpoint is an invalid review id", () => {
    return request(app)
      .get("/api/reviews/nonsense")
      .expect(400)
      .then((result) => {
        expect(result.body.message).toBe("Bad Request");
      });
  });
  test("GET /api/reviews/:review_id responds with status 404 and error message if endpoint is a valid but non-existent review id", () => {
    return request(app)
      .get("/api/reviews/30000")
      .expect(404)
      .then((result) => {
        expect(result.body.message).toBe("Review Not Found");
      });
  });
});

describe("GET /api/reviews/:review_id/comments", () => {
  test("GET request responds with status 200 and an array of comment objects", () => {
    return request(app)
      .get("/api/reviews/3/comments")
      .expect(200)
      .then((result) => {
        expect(Array.isArray(result.body)).toBe(true);
        expect(result.body.length).toBe(3);
      });
  });
  test("GET request responds with array of comment objects with the required properties", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((result) => {
        result.body.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("review_id");
        });
      });
  });
  test("GET request responds with an array of comment objects with properties which are of the correct data type", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((result) => {
        result.body.forEach((comment) => {
          expect(typeof comment.comment_id).toBe("number");
          expect(typeof comment.votes).toBe("number");
          expect(typeof comment.created_at).toBe("string");
          expect(typeof comment.author).toBe("string");
          expect(typeof comment.body).toBe("string");
          expect(typeof comment.review_id).toBe("number");
        });
      });
  });
  test("GET request responds with array of all comment objects sorted most recent comment first as default", () => {
    return request(app)
      .get("/api/reviews/2/comments")
      .expect(200)
      .then((result) => {
        expect(result.body).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("GET request responds with status 404 and error message if route does not exist", () => {
    return request(app)
      .get("/api/reviews/3/commenters")
      .expect(404)
      .then((result) => {
        expect(result.body.message).toBe("Path Not Found");
      });
  });
  test("GET request responds with status 404 and error message if review_id is valid but does not exist", () => {
    return request(app)
      .get("/api/reviews/3000000/comments")
      .expect(404)
      .then((result) => {
        expect(result.body.message).toBe("Path Not Found");
      });
  });
  test("GET request responds with status 404 and error message if no comments exist on that review ID", () => {
    return request(app)
      .get("/api/reviews/1/comments")
      .expect(404)
      .then((result) => {
        expect(result.body.message).toBe("Path Not Found");
      });
  });
  test("GET request responds with status 400 and error message if review_id is invalid", () => {
    return request(app)
      .get("/api/reviews/nonsense/comments")
      .expect(400)
      .then((result) => {
        expect(result.body.message).toBe("Bad Request");
      });
  });
});

describe("GET /api/users", () => {
  test("GET /api/users responds with status 200 and an array of user objects", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((result) => {
        expect(Array.isArray(result.body)).toBe(true);
        expect(result.body.length).toBe(4);
      });
  });
  test("GET /api/users responds with an array of user objects with the required properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((result) => {
        result.body.forEach((user) => {
          expect(user).toHaveProperty("username");
          expect(user).toHaveProperty("name");
          expect(user).toHaveProperty("avatar_url");
        });
      });
  });
  test("GET /api/users responds with an array of review objects with properties which are of the correct data type", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((result) => {
        result.body.forEach((review) => {
          expect(typeof review.username).toBe("string");
          expect(typeof review.name).toBe("string");
          expect(typeof review.avatar_url).toBe("string");
        });
      });
  });
  test("GET /api/users responds with status 404 and error message if endpoint is incorrect", () => {
    return request(app)
      .get("/api/usersssa")
      .expect(404)
      .then((result) => {
        expect(result.body.message).toBe("Path Not Found");
      });
  });
});

describe("POST /api/reviews/:review_id/comments", () => {
  test("POST /api/reviews/1/comments accepts an object with properties of usename and body and responds with status 201 and a response body of the posted comment", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .expect(201)
      .send({
        username: "bainesface",
        body: "Great game for dogs like me",
      })
      .then((response) => {
        expect(response.body.review_id).toBe(1);
        expect(response.body.author).toBe("bainesface");
        expect(response.body.body).toBe("Great game for dogs like me");
      });
  });
  test("POST /api/reviews/1/comments accepts an object with properties of usename, body and extra properties and responds with status 201 and a response body of the posted comment, ignoring extra properties", () => {
    return request(app)
      .post("/api/reviews/2/comments")
      .expect(201)
      .send({
        username: "bainesface",
        extraPropOne: "I have made an extra property",
        body: "Great game for dogs like me",
        extraPropTwo: "I have made another extra property",
      })
      .then((response) => {
        expect(response.body.review_id).toBe(2);
        expect(response.body.author).toBe("bainesface");
        expect(response.body.body).toBe("Great game for dogs like me");
        expect(response.body).not.toHaveProperty("extraPropOne");
        expect(response.body).not.toHaveProperty("extraPropTwo");
      });
  });
  test("POST /api/reviews/1/comments responds with status 400 and error message when comment is missing both required fields", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .expect(400)
      .send({})
      .then((response) => {
        expect(response.body.message).toBe(
          "Bad Request - Missing Required Fields"
        );
      });
  });
  test("POST /api/reviews/1/comments responds with status 400 and error message when comment is missing one of the required fields", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .expect(400)
      .send({ username: "bainesface" })
      .then((response) => {
        expect(response.body.message).toBe(
          "Bad Request - Missing Required Fields"
        );
      });
  });
  test("POST /api/reviews/1/comments responds with status 400 and error message when comment has both required fields but one is an empty string", () => {
    return request(app)
      .post("/api/reviews/1/comments")
      .expect(400)
      .send({ username: "", body: "I have left my name blank" })
      .then((response) => {
        expect(response.body.message).toBe(
          "Bad Request - Missing Required Fields"
        );
      });
  });
  test("POST /api/reviews/review_id/comments responds with status 400 and error message if endpoint is an invalid review id", () => {
    return request(app)
      .post("/api/reviews/nonsense/comments")
      .expect(400)
      .send({
        username: "bainesface",
        body: "Great game for dogs like me",
      })
      .then((result) => {
        expect(result.body.message).toBe("Bad Request");
      });
  });
  test("POST /api/reviews/:review_id/comments responds with status 404 and error message if endpoint is a valid but non-existent review id", () => {
    return request(app)
      .post("/api/reviews/30000/comments")
      .expect(404)
      .send({
        username: "bainesface",
        body: "Great game for dogs like me",
      })
      .then((result) => {
        expect(result.body.message).toBe("Review Not Found");
      });
  });
});

describe("PATCH /api/reviews/:review_id", () => {
  test("PATCH /api/reviews/:review_id responds with status 200 and updated review object when passed an object to update votes", () => {
    return request(app)
      .patch("/api/reviews/1")
      .expect(200)
      .send({
        inc_votes: 50,
      })
      .then((result) => {
        expect(result.body.review_id).toBe(1);
        expect(result.body.title).toBe("Agricola");
        expect(result.body.review_body).toBe("Farmyard fun!");
        expect(result.body.designer).toBe("Uwe Rosenberg");
        expect(result.body.review_img_url).toBe(
          "https://images.pexels.com/photos/974314/pexels-photo-974314.jpeg?w=700&h=700"
        );
        expect(result.body.votes).toBe(51);
        expect(result.body.category).toBe("euro game");
        expect(result.body.owner).toBe("mallionaire");
        expect(result.body.created_at).toBe("2021-01-18T10:00:20.514Z");
      });
  });
  test("PATCH /api/reviews/:review_id respond with status 200 and updated review object when passed an object to decrease votes", () => {
    return request(app)
      .patch("/api/reviews/2")
      .expect(200)
      .send({
        inc_votes: -50,
      })
      .then((result) => {
        expect(result.body.review_id).toBe(2);
        expect(result.body.title).toBe("Jenga");
        expect(result.body.review_body).toBe("Fiddly fun for all the family");
        expect(result.body.designer).toBe("Leslie Scott");
        expect(result.body.review_img_url).toBe(
          "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700"
        );
        expect(result.body.votes).toBe(-45);
        expect(result.body.category).toBe("dexterity");
        expect(result.body.owner).toBe("philippaclaire9");
        expect(result.body.created_at).toBe("2021-01-18T10:01:41.251Z");
      });
  });
  test("PATCH /api/reviews/:review_id responds with status 200 and updated review object with the same vote count when passed an object with value of 0", () => {
    return request(app)
      .patch("/api/reviews/3")
      .expect(200)
      .send({
        inc_votes: 0,
      })
      .then((result) => {
        expect(result.body.review_id).toBe(3);
        expect(result.body.title).toBe("Ultimate Werewolf");
        expect(result.body.review_body).toBe("We couldn't find the werewolf!");
        expect(result.body.designer).toBe("Akihisa Okui");
        expect(result.body.review_img_url).toBe(
          "https://images.pexels.com/photos/5350049/pexels-photo-5350049.jpeg?w=700&h=700"
        );
        expect(result.body.votes).toBe(5);
        expect(result.body.category).toBe("social deduction");
        expect(result.body.owner).toBe("bainesface");
        expect(result.body.created_at).toBe("2021-01-18T10:01:41.251Z");
      });
  });
  test("PATCH /api/reviews/:review_id responds with status 200 and a response body of the updated review object, ignoring extra properties if passed them", () => {
    return request(app)
      .patch("/api/reviews/2/")
      .expect(200)
      .send({
        inc_votes: 10,
        extraProperty: 75,
      })
      .then((result) => {
        expect(result.body.review_id).toBe(2);
        expect(result.body.title).toBe("Jenga");
        expect(result.body.review_body).toBe("Fiddly fun for all the family");
        expect(result.body.designer).toBe("Leslie Scott");
        expect(result.body.review_img_url).toBe(
          "https://images.pexels.com/photos/4473494/pexels-photo-4473494.jpeg?w=700&h=700"
        );
        expect(result.body.votes).toBe(15);
        expect(result.body.category).toBe("dexterity");
        expect(result.body.owner).toBe("philippaclaire9");
        expect(result.body.created_at).toBe("2021-01-18T10:01:41.251Z");
        expect(result.body).not.toHaveProperty("extraProperty");
      });
  });
  test("PATCH /api/reviews/:review_id respond with status 400 and error message when passed an empty object", () => {
    return request(app)
      .patch("/api/reviews/1")
      .expect(400)
      .send({})
      .then((result) => {
        expect(result.body.message).toBe("Bad Request");
      });
  });
  test("PATCH /api/reviews/:review_id respond with status 400 and error message when passed an object with a value that is not a number", () => {
    return request(app)
      .patch("/api/reviews/1")
      .expect(400)
      .send({
        inc_votes: "I vote for this",
      })
      .then((result) => {
        expect(result.body.message).toBe("Bad Request");
      });
  });
  test("PATCH /api/reviews/:review_id responds with status 400 and error message if endpoint is an invalid review id", () => {
    return request(app)
      .patch("/api/reviews/nonsense")
      .expect(400)
      .send({
        inc_votes: 4,
      })
      .then((result) => {
        expect(result.body.message).toBe("Bad Request");
      });
  });
  test("PATCH /api/reviews/:review_id responds with status 404 and error message if endpoint is a valid but non-existent review id", () => {
    return request(app)
      .patch("/api/reviews/30000")
      .expect(404)
      .send({
        inc_votes: 100,
      })
      .then((result) => {
        expect(result.body.message).toBe("Review Not Found");
      });
  });
});
