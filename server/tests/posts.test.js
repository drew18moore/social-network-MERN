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
          expect(newPost.body[field]).toMatch(expectedData[field]);
        } else {
          expect(JSON.stringify(newPost.body[field])).toMatch(
            JSON.stringify(expectedData[field])
          );
        }
      });
    })
  });
  test("Should return 412 if user forgets to include postBody in request", async () => {
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
    const newPost = await request(app)
      .post("/api/posts/new")
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(newPost.statusCode).toBe(412);
  })
  test("Should return 412 if user sends an empty string as the postBody", async () => {
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
    const postBody = "";
    const newPost = await request(app)
      .post("/api/posts/new")
      .send({ postBody: postBody })
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(newPost.statusCode).toBe(412);
  })
});

describe("GET /posts/:id", () => {
  test("Should respond with 200 status code and correct json data, on successful request", async () => {
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
    // Get post by id
    const getPostById = await request(app)
      .get(`/api/posts/${newPost.body._id}`)
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(getPostById.statusCode).toBe(200)
    const expectedData = {
      createdAt: /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/,
      fullname: userData.fullname,
      username: userData.username,
      numLikes: 0,
      isLiked: false,
      postBody: postBody,
      userId: registeredUser.body._id,
      _id: /^[a-z0-9]+$/i,
      profilePicture: "/default-pfp",
      comments: [],
      isBookmarked: false
    };
    Object.keys(expectedData).forEach((field) => {
      if (typeof getPostById.body[field] === "string") {
        expect(getPostById.body[field]).toMatch(expectedData[field]);
      } else {
        expect(JSON.stringify(getPostById.body[field])).toMatch(
          JSON.stringify(expectedData[field])
        );
      }
    });
  })
})