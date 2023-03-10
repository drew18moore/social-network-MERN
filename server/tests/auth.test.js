const request = require("supertest");
const app = require("../app");
const { connect, disconnect } = require("./config/database");
const User = require("../models/User");
const bcrypt = require("bcrypt");

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
        username: "testusername",
        password: "password123",
      });
      expect(response.statusCode).toBe(200);
    });

    test("If username already exists, respond with a 403 status code", async () => {
      const response = await request(app).post("/api/auth/register").send({
        fullname: "test fullname",
        username: "testusername",
        password: "password123",
      });
      expect(response.statusCode).toBe(200);

      const response2 = await request(app).post("/api/auth/register").send({
        fullname: "test fullname",
        username: "testusername",
        password: "password123",
      });
      expect(response2.statusCode).toBe(403);
    });

    test("Database should have correctly stored the given user data", async () => {
      const fullname = "test fullname";
      const username = "testusername";
      const password = "password123";

      const response = await request(app).post("/api/auth/register").send({
        fullname: fullname,
        username: username,
        password: password,
      });
      expect(response.statusCode).toBe(200);

      const user = await User.findById(response.body._id)
      expect(user.fullname).toBe(fullname)
      expect(user.username).toBe(username)
      expect(await bcrypt.compare(password, user.password)).toBe(true)
      expect(user.bio).toBe("")
      expect(user.following).toEqual([])
      expect(user.followers).toEqual([])
      expect(user.refreshToken).toBeTruthy()
    });
  });
});
