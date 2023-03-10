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
  describe("Given a fullname, username, and password", () => {
    test("if successfull, should respond with a 200 status code", async () => {
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

    test("If successfull, database should have correctly stored the given user data", async () => {
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

    test("If successfull, the correct data is sent as a response", async () => {
      const userData = {
        fullname: "test fullname",
        username: "testusername",
        password: "password123",
      }

      const response = await request(app).post("/api/auth/register").send(userData);
      expect(response.statusCode).toBe(200);

      const correctResponse = {
        _id: /^[a-z0-9]+$/i,
        fullname: userData.fullname,
        username: userData.username,
        following: /^\[\s*\]$/,
        followers: /^\[\s*\]$/,
        accessToken: /^[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]*$/,
        bio: ""
      }
      Object.keys(correctResponse).forEach(field => {
        console.log(field, JSON.stringify(response.body[field]), correctResponse[field], typeof response.body[field]);
        if (typeof response.body[field] === "string") {
          expect(response.body[field]).toMatch(correctResponse[field]);
        } else {
          expect(JSON.stringify(response.body[field])).toMatch(correctResponse[field]);
        }
      })
    })
  });
});
