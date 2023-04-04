const request = require("supertest");
const app = require("../app");
const { connect, disconnect, reset } = require("./config/database");
const Comment = require("../models/Comment");

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await reset();
});

afterAll(async () => {
  await disconnect();
});

describe("POST /comments/new", () => {
  describe("On success, return 200 status code and...", () => {
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
      // New comment
      const commentBody = "Comment 1";
      const newComment = await request(app)
        .post("/api/comments/new")
        .send({ parentId: newPost.body._id, commentBody: commentBody })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(newComment.statusCode).toBe(200);
      const expectedData = {
        userId: registeredUser.body._id,
        parentId: newPost.body._id,
        commentBody: commentBody,
        likes: [],
        comments: [],
        _id: /^[a-z0-9]+$/i,
        createdAt: /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/,
      };
      Object.keys(expectedData).forEach((field) => {
        if (typeof newComment.body[field] === "string") {
          expect(newComment.body[field]).toMatch(expectedData[field]);
        } else {
          expect(JSON.stringify(newComment.body[field])).toMatch(
            JSON.stringify(expectedData[field])
          );
        }
      });
    });
    test("Should save new comment to db", async () => {
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
      // New comment
      const commentBody = "Comment 1";
      const newComment = await request(app)
        .post("/api/comments/new")
        .send({ parentId: newPost.body._id, commentBody: commentBody })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(newComment.statusCode).toBe(200);
      const comment = await Comment.findById(newComment.body._id)
      expect(comment.userId).toEqual(registeredUser.body._id)
      expect(comment.parentId).toEqual(newPost.body._id)
      expect(comment.commentBody).toEqual(commentBody)
      expect(comment.likes).toEqual([])
    });
  });
});
