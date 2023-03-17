const request = require("supertest");
const app = require("../app");
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
  describe("On success...", () => {
    test("return 200 status code", async () => {
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
      }
      const updatedUser = await request(app)
        .put(`/api/users/${registeredUser.body._id}`)
        .send(updates)
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(updatedUser.statusCode).toBe(200);
      const expectedResponseBody = {
        fullname: updates.fullname,
        username: updates.username,
        bio: updates.bio,
      }
      expect(updatedUser.body).toEqual(expectedResponseBody)
    })
  })
})