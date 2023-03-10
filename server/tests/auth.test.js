const request = require("supertest");
const app = require("../app");
const { connect, disconnect } = require("./config/database");

beforeEach(async () => {
  await connect();
});

afterEach(async () => {
  await disconnect();
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

    test("If username already exists, respond with a 403 status code", async () => {
      const response = await request(app).post("/api/auth/register").send({
        fullname: "fullname",
        username: "username",
        password: "password",
      });
      expect(response.statusCode).toBe(200);

      const response2 = await request(app).post("/api/auth/register").send({
        fullname: "fullname",
        username: "username",
        password: "password",
      });
      expect(response2.statusCode).toBe(403);
    });
  });
});
