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
        expect(body.message).toBe('Endpoint Not Found');
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
        expect(topics.length).toBeGreaterThan(0);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty('slug');
          expect(topic).toHaveProperty('description');
        })
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
        expect(body.message).toBe('Bad Request: article_id must be a number');
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
        expect(articles.length).toBeGreaterThan(0);
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
  test("200: Responds with an array sorted by created_at in descending order", () => {
    return request(app)
    .get("/api/articles")
    .expect(200)
    .then(({ body })=>{
      const { articles } = body;
      expect(articles).toBeSortedBy('created_at', { descending: true });
    });
  });
  test("400: Responds with Bad Request: Invalid Query when passed an invalid sort_by or order_by query ", () => {
    return request(app)
    .get("/api/articles?sort_by=name")
    .expect(400)
    .then(({ body })=>{
      expect(body.message).toBe('Bad Request: Invalid Query')
    });
  });
});
