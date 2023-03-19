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

describe("GET /users/:username", () => {
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
    };
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
  test("If user doesn't exist, respond with a 500 status code", async () => {
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
      .get(`/api/users/user123`)
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(response.statusCode).toBe(500);
  });
});

describe("PUT /users/follow/:username", () => {
  test("On success, respond with 200 status code and update the db", async () => {
    const userData1 = {
      fullname: "test fullname",
      username: "testusername",
      password: "password123",
    };
    const registeredUser1 = await request(app)
      .post("/api/auth/register")
      .send(userData1);
    expect(registeredUser1.statusCode).toBe(200);
    const userData2 = {
      fullname: "test fullname2",
      username: "testusername2",
      password: "password123",
    };
    const registeredUser2 = await request(app)
      .post("/api/auth/register")
      .send(userData2);
    expect(registeredUser2.statusCode).toBe(200);
    // Follow user
    const response = await request(app)
      .put(`/api/users/follow/${userData2.username}`)
      .send({ currUsername: userData1.username })
      .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
    expect(response.statusCode).toBe(200);
    let user1 = await User.findById(registeredUser1.body._id);
    let user2 = await User.findById(registeredUser2.body._id);
    expect(user1.following).toContain(user2._id.toString());
    expect(user2.followers).toContain(user1._id.toString());
    // Unfollow user
    const response2 = await request(app)
      .put(`/api/users/follow/${userData2.username}`)
      .send({ currUsername: userData1.username })
      .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
    expect(response2.statusCode).toBe(200);
    user1 = await User.findById(registeredUser1.body._id);
    user2 = await User.findById(registeredUser2.body._id);
    expect(user1.following).not.toContain(user2._id.toString());
    expect(user2.followers).not.toContain(user1._id.toString());
  });
  test("If username in req.params and req.body match, return 403 status code", async () => {
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
      .put(`/api/users/follow/${userData.username}`)
      .send({ currUsername: userData.username })
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(response.statusCode).toBe(403);
  });
  test("If username in req.params doesn't exist, return 500 status code", async () => {
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
      .put(`/api/users/follow/fakeusername`)
      .send({ currUsername: userData.username })
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(response.statusCode).toBe(500);
  })
  test("If username in req.body doesn't exist, return 500 status code", async () => {
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
      .put(`/api/users/follow/${userData.username}`)
      .send({ currUsername: "fakeusername" })
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(response.statusCode).toBe(500);
  })
});

describe("GET /users/all-unfollowed/:id", () => {
  
})