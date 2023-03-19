const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("../app");
const User = require("../models/User");
const { connect, disconnect, reset } = require("./config/database");

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await reset();
});

afterAll(async () => {
  await disconnect();
});

describe("PUT /users/:id", () => {
  test("On success, return 200 status code, return correct JSON data, and store correct data in DB", async () => {
    const userData = {
      fullname: "test fullname",
      username: "testusername",
      password: "password123",
    };
    const registeredUser = await request(app)
      .post("/api/auth/register")
      .send(userData);
    expect(registeredUser.statusCode).toBe(200);
    const updates = {
      userId: registeredUser.body._id,
      fullname: "new fullname",
      username: "newusername",
      bio: "new bio",
      password: userData.password,
    };
    const updatedUser = await request(app)
      .put(`/api/users/${registeredUser.body._id}`)
      .send(updates)
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(updatedUser.statusCode).toBe(200);
    const expectedResponseBody = {
      fullname: updates.fullname,
      username: updates.username,
      bio: updates.bio,
    };
    expect(updatedUser.body).toEqual(expectedResponseBody);
    const user = await User.findById(registeredUser.body._id);
    expect(user.fullname).toEqual(updates.fullname);
    expect(user.username).toEqual(updates.username);
    expect(user.bio).toEqual(updates.bio);
  });

  test("If userId in req.body doesn't match id in params, return 403 status code", async () => {
    const updates = {
      userId: "987654321",
      fullname: "new fullname",
      username: "newusername",
      bio: "new bio",
      password: "password123",
    };
    // Create access token so the middleware passes
    const accessToken = jwt.sign(
      { userId: updates.userId },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    const updatedUser = await request(app)
      .put(`/api/users/123456789`)
      .send(updates)
      .set("Authorization", `Bearer ${accessToken}`);
    expect(updatedUser.statusCode).toBe(403);
  });

  test("If password is incorrect, return 400 status code", async () => {
    const userData = {
      fullname: "test fullname",
      username: "testusername",
      password: "password123",
    };
    const registeredUser = await request(app)
      .post("/api/auth/register")
      .send(userData);
    expect(registeredUser.statusCode).toBe(200);
    const updates = {
      userId: registeredUser.body._id,
      fullname: "new fullname",
      username: "newusername",
      bio: "new bio",
      password: "wrongpassword",
    };
    const updatedUser = await request(app)
      .put(`/api/users/${registeredUser.body._id}`)
      .send(updates)
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(updatedUser.statusCode).toBe(400);
  });
});

describe("GET /:username", () => {
  test("On success, 200 status code is returned and correct json data is sent", async () => {
    const userData = {
      fullname: "test fullname",
      username: "testusername",
      password: "password123",
    };
    const registeredUser = await request(app)
      .post("/api/auth/register")
      .send(userData);
    expect(registeredUser.statusCode).toBe(200);
    const response = await request(app)
      .get(`/api/users/${userData.username}`)
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(response.statusCode).toBe(200);
    const expectedData = {
      _id: registeredUser.body._id,
      fullname: registeredUser.body.fullname,
      username: registeredUser.body.username,
      numFollowing: /^-?\d+$/,
      numFollowers: /^-?\d+$/,
      isFollowing: /^(true|false)$/,
      img: /^.*$/,
      bio: /^.*$/,
    }
    Object.keys(expectedData).forEach((field) => {
      if (typeof response.body[field] === "string") {
        expect(response.body[field]).toMatch(expectedData[field]);
      } else {
        expect(JSON.stringify(response.body[field])).toMatch(
          expectedData[field]
        );
      }
    });
  });
});
