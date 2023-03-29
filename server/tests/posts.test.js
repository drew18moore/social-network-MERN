const request = require("supertest");
const app = require("../app");
const Post = require("../models/Post");
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

describe("POST /posts/new", () => {
  describe("On success, return 200 status code and...", () => {
    test("Should add post to database", async () => {
      // Register user
      const userData = {
        fullname: "test fullname",
        username: "testusername",
        password: "password123",
      };
      const registeredUser = await request(app)
        .post("/api/auth/register")
        .send(userData);
      expect(registeredUser.statusCode).toBe(200);
      // New Post
      const postBody = "Post 1";
      const newPost = await request(app)
        .post("/api/posts/new")
        .send({ postBody: postBody })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(newPost.statusCode).toBe(200);
      const post = await Post.findById(newPost.body._id);
      expect(post.userId).toBe(registeredUser.body._id);
      expect(post.postBody).toBe(postBody);
      expect(post.likes).toEqual([]);
      expect(post.comments).toEqual([]);
    });
    test("Should return correct json data", async () => {
      // Register user
      const userData = {
        fullname: "test fullname",
        username: "testusername",
        password: "password123",
      };
      const registeredUser = await request(app)
        .post("/api/auth/register")
        .send(userData);
      expect(registeredUser.statusCode).toBe(200);
      // New Post
      const postBody = "Post 1";
      const newPost = await request(app)
        .post("/api/posts/new")
        .send({ postBody: postBody })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(newPost.statusCode).toBe(200);
      const expectedData = {
        userId: registeredUser.body._id,
        postBody: postBody,
        likes: [],
        comments: [],
        _id: /^[a-z0-9]+$/i,
        createdAt: /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/,
        fullname: userData.fullname,
        username: userData.username,
        profilePicture: "/default-pfp.jpg"
      }
      Object.keys(expectedData).forEach((field) => {
        if (typeof newPost.body[field] === "string") {
          console.log(newPost.body[field], expectedData[field]);
          expect(newPost.body[field]).toMatch(expectedData[field]);
        } else {
          console.log(newPost.body[field], expectedData[field]);
          expect(JSON.stringify(newPost.body[field])).toMatch(
            JSON.stringify(expectedData[field])
          );
        }
      });
    })
  });
});
