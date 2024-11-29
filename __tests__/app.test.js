const endpointsJson = require("../endpoints.json");
const app = require('../app');
const request = require('supertest');
const db = require('../db/connection');
const seed = require('../db/seeds/seed')
const testData = require('../db/data/test-data')

afterAll(() => {
  return db.end();
});

beforeEach(() => {
  return seed(testData);
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
  test("404: Responds with Endpoint Not Found when the endpoint is incorrect/non-existent", () => {
    return request(app)
      .get('/ap')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('Error: Endpoint Not Found');
      });
  });
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics }  = body;
        expect(topics.length).toBe(3);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty('slug');
          expect(topic).toHaveProperty('description');
        })
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with an array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        const { users }  = body;
        expect(users.length).toBe(4);
        users.forEach((user) => {
          expect(user).toHaveProperty('username');
          expect(user).toHaveProperty('name');
          expect(user).toHaveProperty('avatar_url');
        })
      });
  });
});

describe("GET /api/articles", () => {
  test("200: Responds with an array of article objects containing the correct properties, and excluding the body property", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        const { articles }  = body;
        expect(articles.length).toBe(13);
        articles.forEach((article) => {
        expect(article).toHaveProperty('article_id');
        expect(article).toHaveProperty('title');
        expect(article).toHaveProperty('topic');
        expect(article).toHaveProperty('author');
        expect(article).toHaveProperty('created_at');
        expect(article).toHaveProperty('votes');
        expect(article).toHaveProperty('article_img_url');
        expect(article).toHaveProperty('comment_count');
        
        expect(article.body).toBeUndefined();
        });
      });
  });
  test("200: Responds with an array of articles sorted by default values created_at in descending order", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body })=>{
      const { articles } = body;
      expect(articles).toBeSortedBy('created_at', { descending: true });
    });
  });
  test("200: Responds with an array of articles sorted and ordered by user query", () => {
    return request(app)
    .get("/api/articles?sort_by=title&order_by=ASC")
    .expect(200)
    .then(({ body })=>{
      const { articles } = body;
      expect(articles).toBeSortedBy('title', { descending: false });
    });
  });
  test("400: Responds with Bad Request: Invalid Query when passed an invalid sort_by or order_by query ", () => {
    return request(app)
    .get("/api/articles?sort_by=invalid_column")
    .expect(400)
    .then(({ body }) => {
      expect(body.message).toBe("Bad Request: Invalid Query");
    })
    .then(() => {
      return request(app)
        .get("/api/articles?order_by=invalid_order")
        .expect(400)
        .then(({ body }) => {
          expect(body.message).toBe("Bad Request: Invalid Query");
        });
    });
  });
  test("200: Responds with articles filtered by topic", () => {
    return request(app)
      .get("/api/articles?topic=cats")
      .expect(200)
      .then(({ body }) => {
        const { articles } = body
        expect(articles).toHaveLength(1);
        articles.forEach((article) => {
          expect(article.topic).toBe("cats");
        });
    });
  });
  test("404: Responds with Bad Request if topic does not exist", () => {
    return request(app)
      .get("/api/articles?topic=notatopic")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not Found: notatopic topic does not exist");
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Responds with an article object containing the correct properties", () => {
    return request(app)
      .get("/api/articles/1")
      .expect(200)
      .then(({ body }) => {
        const { article }  = body;
        expect(article).toHaveProperty('author');
        expect(article).toHaveProperty('title');
        expect(article).toHaveProperty('article_id');
        expect(article).toHaveProperty('body');
        expect(article).toHaveProperty('topic');
        expect(article).toHaveProperty('created_at');
        expect(article).toHaveProperty('votes');
        expect(article).toHaveProperty('article_img_url');
        expect(article).toHaveProperty('comment_count');
      })
  });
  test("404: Responds with Not Found when passed an incorrect/non-existent article_id", () => {
    return request(app)
      .get('/api/articles/100')
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe('Not Found: no article found for article_id 100');
      });
  });
  test("400: Responds with Bad Request when passed an invalid article_id", () => {
    return request(app)
      .get('/api/articles/NaN')
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe('Bad Request: Invalid input syntax');
      });
  });
});

describe("GET /api/articles/:article_id/comments", () => {
  test("200: Responds with an array of comments for the given article_id, sorted by most recent first", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments }  = body;
        expect(comments).toHaveLength(2)
        comments.forEach((comment) => {
          expect(comment).toHaveProperty("comment_id");
          expect(comment).toHaveProperty("votes");
          expect(comment).toHaveProperty("created_at");
          expect(comment).toHaveProperty("author");
          expect(comment).toHaveProperty("body");
          expect(comment).toHaveProperty("article_id");
        });
        expect(comments[0]).toMatchObject({
          body: "Oh, I've got compassion running out of my nose, pal! I'm the Sultan of Sentiment!",
          votes: 16,
          author: "butter_bridge",
          article_id: 9,
        });
        expect(comments[1]).toMatchObject({
          body: "The owls are not what they seem.",
          votes: 20,
          author: "icellusedkars",
          article_id: 9,
        });
        expect(typeof comments[0].created_at).toBe("string");
      });
  });
  test("200: Responds with an array sorted by created_at in descending order", () => {
    return request(app)
      .get("/api/articles/9/comments")
      .expect(200)
      .then(({ body })=>{
        const { comments } = body;
        expect(comments).toBeSortedBy('created_at', { descending: true });
      });
  });
  test("404: Responds with Not Found when passed a non-existent article_id", () => {
    return request(app)
      .get("/api/articles/864/comments")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not Found: no article found for article_id 864");
      });
  });
  test("400: Responds with Bad Request when passed an invalid article_id", () => {
    return request(app)
      .get("/api/articles/NaN/comments")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request: Invalid input syntax");
      });
  });
  test("200: Responds with an empty array if there are no comments attached to the article", () => {
    return request(app)
      .get("/api/articles/2/comments")
      .expect(200)
      .then(({ body }) => {
        const { comments } = body;
        expect(comments).toHaveLength(0);
      });
  });
});

describe("POST /api/articles/:article_id/comments", () => {
  const commentTest = { username: "butter_bridge", body: "Great article!" }
  test("201: Responds with the posted comment when successful", () => {
    return request(app)
      .post("/api/articles/9/comments")
      .send(commentTest)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body
        expect(comment).toMatchObject({
          author: "butter_bridge",
          body: "Great article!",
          article_id: 9
        });
        expect(comment).toHaveProperty("comment_id");
        expect(comment).toHaveProperty("created_at");
        expect(comment).toHaveProperty("votes");
      });
  });
  test("400: Responds with Bad Request when passed an invalid article_id", () => {
    return request(app)
      .post("/api/articles/NaN/comments")
      .send(commentTest)
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request: Invalid input syntax")
      });
  });
  test("400: Responds with Bad Request when username or body is missing from request body", () => {
    return request(app)
      .post("/api/articles/1/comments")
      .send({ username: "butter_bridge" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request: Missing required data")
      })
      .then(() => {
        return request(app)
          .post("/api/articles/2/comments")
          .send({ body: "This is a test!" })
          .expect(400)
          .then(({ body }) => {
            expect(body.message).toBe("Bad Request: Missing required data");
          });
      });
  });
  test("404: Responds with Not Found when passed a non-existent article_id", () => {
    return request(app)
      .post("/api/articles/923/comments")
      .send(commentTest)
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not Found: no article found for article_id 923")
      });
  });
});

describe("PATCH /api/articles/:article_id/", () => {
  test("200: Responds with the updated article", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({
        inc_votes: 3
      })
      .expect(200)
      .then(({ body }) => {
        const { article } = body
        expect(article.article_id).toBe(1)
        expect(article.votes).toBe(103)
        });
  });
  test("400: Responds with Bad Request when inc_votes is missing", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request: Missing required data")
      });
  });
  test("400: Responds with Bad Request when inc_votes is not a number", () => {
    return request(app)
      .patch("/api/articles/1")
      .send({ inc_votes: "two" })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request: Invalid input syntax");
      });
  });
  test("400: Responds with Bad Request when passed an invalid article_id", () => {
    return request(app)
      .patch("/api/articles/NaN")
      .send({ inc_votes: 1 })
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request: Invalid input syntax")
      });
  });
  test("404: Responds with Not Found when passed a non-existent article_id", () => {
    return request(app)
      .patch("/api/articles/962")
      .send({ inc_votes: 1 })
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not Found: no article found for article_id 962");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: Responds with no content when the comment is deleted successfully", () => {
    return request(app)
      .delete("/api/comments/1")
      .expect(204);
  });

  test("404: Responds with Not Found when comment_id does not exist", () => {
    return request(app)
      .delete("/api/comments/924")
      .expect(404)
      .then(({ body }) => {
        expect(body.message).toBe("Not Found: no comment found for comment_id 924");
      });
  });

  test("400: Responds with Bad Request when comment_id is invalid data type", () => {
    return request(app)
      .delete("/api/comments/NaN")
      .expect(400)
      .then(({ body }) => {
        expect(body.message).toBe("Bad Request: Invalid input syntax");
      });
  });
});