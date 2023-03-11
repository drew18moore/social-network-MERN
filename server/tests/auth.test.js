const request = require("supertest");
const app = require("../app");
const { connect, disconnect, reset } = require("./config/database");
const User = require("../models/User");
const bcrypt = require("bcrypt");

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await reset();
});

afterAll(async () => {
  await disconnect();
});

describe("POST /auth/register", () => {
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

      const user = await User.findById(response.body._id);
      expect(user.fullname).toBe(fullname);
      expect(user.username).toBe(username);
      expect(await bcrypt.compare(password, user.password)).toBe(true);
      expect(user.bio).toBe("");
      expect(user.following).toEqual([]);
      expect(user.followers).toEqual([]);
      expect(user.refreshToken).toBeTruthy();
    });

    test("If successfull, the correct data is sent as a response", async () => {
      const userData = {
        fullname: "test fullname",
        username: "testusername",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData);
      expect(response.statusCode).toBe(200);

      const correctResponse = {
        _id: /^[a-z0-9]+$/i,
        fullname: userData.fullname,
        username: userData.username,
        following: /^\[\s*\]$/,
        followers: /^\[\s*\]$/,
        accessToken: /^[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]*$/,
        bio: "",
      };
      Object.keys(correctResponse).forEach((field) => {
        if (typeof response.body[field] === "string") {
          expect(response.body[field]).toMatch(correctResponse[field]);
        } else {
          expect(JSON.stringify(response.body[field])).toMatch(
            correctResponse[field]
          );
        }
      });
    });
  });

  test("If the fullname is an empty string in the request, respond with a 400 status code", async () => {
    const userData = {
      fullname: "",
      username: "testusername",
      password: "password123",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);
    expect(response.statusCode).toBe(400);
  });

  test("If the fullname is missing in the request, respond with a 400 status code", async () => {
    const userData = {
      username: "testusername",
      password: "password123",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);
    expect(response.statusCode).toBe(400);
  });

  test("If the username is an empty string in the request, respond with a 400 status code", async () => {
    const userData = {
      fullname: "test fullname",
      username: "",
      password: "password123",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);
    expect(response.statusCode).toBe(400);
  });

  test("If the username is missing in the request, respond with a 400 status code", async () => {
    const userData = {
      fullname: "test fullname",
      password: "password123",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);
    expect(response.statusCode).toBe(400);
  });

  test("If the password is an empty string in the request, respond with a 400 status code", async () => {
    const userData = {
      fullname: "test fullname",
      username: "testusername",
      password: "",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);
    expect(response.statusCode).toBe(400);
  });

  test("If the password is missing in the request, respond with a 400 status code", async () => {
    const userData = {
      fullname: "test fullname",
      username: "testusername",
    };

    const response = await request(app)
      .post("/api/auth/register")
      .send(userData);
    expect(response.statusCode).toBe(400);
  });
});

describe("POST /auth/login", () => {
  describe("Given a username, and password", () => {
    test("if successfull, should respond with a 200 status code", async () => {
      const response = await request(app).post("/api/auth/register").send({
        fullname: "test fullname",
        username: "testusername",
        password: "password123",
      });
      expect(response.statusCode).toBe(200);

      const response2 = await request(app).post("/api/auth/login").send({
        username: "testusername",
        password: "password123",
      });
      expect(response2.statusCode).toBe(200);
    });

    test("If username doesn't exists, respond with a 404 status code", async () => {
      const response = await request(app).post("/api/auth/login").send({
        username: "testusername",
        password: "password123",
      });
      expect(response.statusCode).toBe(404);
    });

    test("If username exists but password is incorrect, respond with a 400 status code", async () => {
      const response = await request(app).post("/api/auth/register").send({
        fullname: "test fullname",
        username: "testusername",
        password: "password123",
      });
      expect(response.statusCode).toBe(200);

      const response2 = await request(app).post("/api/auth/login").send({
        username: "testusername",
        password: "password1234",
      });
      expect(response2.statusCode).toBe(400);
    });

    test("If successfull login, the correct data is sent as a response", async () => {
      // Register new user
      const userData = {
        fullname: "test fullname",
        username: "testusername",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/register")
        .send(userData);
      expect(response.statusCode).toBe(200);

      // Login new user
      const userData2 = {
        username: "testusername",
        password: "password123",
      };

      const response2 = await request(app)
        .post("/api/auth/login")
        .send(userData2);
      expect(response2.statusCode).toBe(200);

      const correctResponse = {
        _id: /^[a-z0-9]+$/i,
        fullname: userData.fullname,
        username: userData2.username,
        following: /^\[.*\]$/,
        followers: /^\[.*\]$/,
        accessToken: /^[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]+\.[a-zA-Z0-9-_]*$/,
        bio: /^.*$/,
      };
      Object.keys(correctResponse).forEach((field) => {
        if (typeof response2.body[field] === "string") {
          expect(response2.body[field]).toMatch(correctResponse[field]);
        } else {
          expect(JSON.stringify(response2.body[field])).toMatch(
            correctResponse[field]
          );
        }
      });
    });
  });

  describe("Given invalid input", () => {
    test("If the username is an empty string in the request, respond with a 400 status code", async () => {
      const userData = {
        username: "",
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(userData);
      expect(response.statusCode).toBe(400);
    });

    test("If the username is missing in the request, respond with a 400 status code", async () => {
      const userData = {
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(userData);
      expect(response.statusCode).toBe(400);
    });

    test("If the password is an empty string in the request, respond with a 400 status code", async () => {
      const userData = {
        username: "testusername",
        password: "",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(userData);
      expect(response.statusCode).toBe(400);
    });

    test("If the password is missing in the request, respond with a 400 status code", async () => {
      const userData = {
        username: "testusername",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(userData);
      expect(response.statusCode).toBe(400);
    });
  });
});
