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
});
