const request = require("supertest");
const app = require("../app");
const { connect, disconnect } = require("./config/database");

beforeEach(() => {
  connect();
});

afterEach(() => {
  disconnect();
});

describe("POST /register", () => {
  describe("Given a fullname, unique username, and password", () => {
    test("Should respond with a 200 status code", async () => {
      const response = await request(app).post("/api/auth/register").send({
        fullname: "test fullname",
        username: "test username",
        password: "test password",
      });
      expect(response.statusCode).toBe(200);
    });
  });
});
