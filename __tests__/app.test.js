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
});

describe("GET /api/topics", () => {
  test("200: Responds with an array of topics", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const { topics }  = body;
        expect(Array.isArray(topics)).toBe(true);
        topics.forEach((topic) => {
          expect(topic).toHaveProperty('slug');
          expect(topic).toHaveProperty('description');
        })
      });
    });
  test("404: Responds with Endpoint Not Found when the endpoint is incorrect", () => {
  return request(app)
    .get('/api/topis')
    .expect(404)
    .then(({ body }) => {
      expect(body.message).toBe('Endpoint Not Found');
    });
  });
});

// test("500: Responds with Internal Server Error when a database query fails", () => {
//   return request(app)
//     .get('/api/topics')
//     .expect(500)
//     .then(({ body }) => {
//       expect(body.msg).toBe('Internal Server Error');
//     });
// });