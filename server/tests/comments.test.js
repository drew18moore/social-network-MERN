const request = require("supertest");
const app = require("../app");
const { connect, disconnect, reset } = require("./config/database");
const Comment = require("../models/Comment");
const Post = require("../models/Post")

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
      const comment = await Comment.findById(newComment.body._id);
      expect(comment.userId).toEqual(registeredUser.body._id);
      expect(comment.parentId).toEqual(newPost.body._id);
      expect(comment.commentBody).toEqual(commentBody);
      expect(comment.likes).toEqual([]);
    });
  });
  test("Should return 404 status code if parent post isn't found", async () => {
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
    // New comment
    const commentBody = "Comment 1";
    const newComment = await request(app)
      .post("/api/comments/new")
      .send({ parentId: "5509f07f227cde6d205a0962", commentBody: commentBody })
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(newComment.statusCode).toBe(404);
  });
  test("Should return 400 status code if request is missing commentBody", async () => {
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
    const newComment = await request(app)
      .post("/api/comments/new")
      .send({ parentId: newPost.body._id })
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(newComment.statusCode).toBe(400);
  });
  test("Should return 400 status code if commentBody is an empty string", async () => {
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
    const commentBody = "";
    const newComment = await request(app)
      .post("/api/comments/new")
      .send({ parentId: newPost.body._id, commentBody: commentBody })
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(newComment.statusCode).toBe(400);
  });
  test("Should return 400 status code if request is missing parentId", async () => {
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
    // New comment
    const commentBody = "Comment 1";
    const newComment = await request(app)
      .post("/api/comments/new")
      .send({ commentBody: commentBody })
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(newComment.statusCode).toBe(400);
  });
});

describe("PUT /comments/:id", () => {
  describe("On success, return 200 status code and...", () => {
    test("Should update comment in db", async () => {
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
      let comment = await Comment.findById(newComment.body._id);
      // Edit comment
      const updatedCommentBody = "Updated comment";
      const updatedComment = await request(app)
        .put(`/api/comments/${newComment.body._id}`)
        .send({ postBody: updatedCommentBody })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(updatedComment.statusCode).toBe(200);
      comment = await Comment.findById(newComment.body._id);
      expect(comment.commentBody).toEqual(updatedCommentBody);
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
      // New comment
      const commentBody = "Comment 1";
      const newComment = await request(app)
        .post("/api/comments/new")
        .send({ parentId: newPost.body._id, commentBody: commentBody })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(newComment.statusCode).toBe(200);
      // Edit comment
      const updatedCommentBody = "Updated comment";
      const updatedComment = await request(app)
        .put(`/api/comments/${newComment.body._id}`)
        .send({ postBody: updatedCommentBody })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(updatedComment.statusCode).toBe(200);
      expectedData = {
        userId: registeredUser.body._id,
        parentId: newPost.body._id,
        commentBody: updatedCommentBody,
        likes: [],
        comments: [],
        _id: /^[a-z0-9]+$/i,
        createdAt: /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/,
      };
      Object.keys(expectedData).forEach((field) => {
        if (typeof updatedComment.body[field] === "string") {
          expect(updatedComment.body[field]).toMatch(expectedData[field]);
        } else {
          expect(JSON.stringify(updatedComment.body[field])).toMatch(
            JSON.stringify(expectedData[field])
          );
        }
      });
    });
  });
  test("Should return 404 status code if comment isn't found", async () => {
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
    // Edit comment
    const updatedCommentBody = "Updated comment";
    const updatedComment = await request(app)
      .put(`/api/comments/5509f07f227cde6d205a0962`)
      .send({ postBody: updatedCommentBody })
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(updatedComment.statusCode).toBe(404);
  })
  test("Should return 403 status code if comment's userId doesn't match auth user's id", async () => {
    // Register main user
    const userData1 = {
      fullname: "test fullname",
      username: "testusername1",
      password: "password123",
    };
    const registeredUser1 = await request(app)
      .post("/api/auth/register")
      .send(userData1);
    expect(registeredUser1.statusCode).toBe(200);
    // Register second user
    const userData2 = {
      fullname: "test fullname",
      username: "testusername2",
      password: "password123",
    };
    const registeredUser2 = await request(app)
      .post("/api/auth/register")
      .send(userData2);
    expect(registeredUser2.statusCode).toBe(200);
    // New Post
    const postBody = "Post 1";
    const newPost = await request(app)
      .post("/api/posts/new")
      .send({ postBody: postBody })
      .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
    expect(newPost.statusCode).toBe(200);
    // New comment
    const commentBody = "Comment 1";
    const newComment = await request(app)
      .post("/api/comments/new")
      .send({ parentId: newPost.body._id, commentBody: commentBody })
      .set("Authorization", `Bearer ${registeredUser2.body.accessToken}`);
    expect(newComment.statusCode).toBe(200);
    // Edit comment
    const updatedCommentBody = "Updated comment";
    const updatedComment = await request(app)
      .put(`/api/comments/${newComment.body._id}`)
      .send({ postBody: updatedCommentBody })
      .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
    expect(updatedComment.statusCode).toBe(403);
  })
  test("Should return 400 status code if commentBody is missing from the request body", async () => {
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
    // Edit comment
    const updatedComment = await request(app)
      .put(`/api/comments/${newComment.body._id}`)
      .send({})
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(updatedComment.statusCode).toBe(400);
  })
  test("Should return 400 status code if commentBody is missing from the request body", async () => {
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
    // Edit comment
    const updatedCommentBody = "";
    const updatedComment = await request(app)
      .put(`/api/comments/${newComment.body._id}`)
      .send({ postBody: updatedCommentBody })
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(updatedComment.statusCode).toBe(400);
  })
});

describe("DELETE /comments/:id", () => {
  describe("On success, return 200 status code and...", () => {
    test("Should delete comment from db", async () => {
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
      let comment = await Comment.findById(newComment.body._id)
      expect(comment).toBeTruthy()
      // Delete comment
      const deleteComment = await request(app)
        .delete(`/api/comments/${newComment.body._id}`)
        .send({ parentId: newPost.body._id })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(deleteComment.statusCode).toBe(200);
      comment = await Comment.findById(newComment.body._id)
      expect(comment).not.toBeTruthy()
    })
    test("Should remove comment id from parent's comments list", async () => {
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
      let parentPost = await Post.findById(newPost.body._id)
      expect(parentPost.comments).toContain(newComment.body._id)
      // Delete comment
      const deleteComment = await request(app)
        .delete(`/api/comments/${newComment.body._id}`)
        .send({ parentId: newPost.body._id })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(deleteComment.statusCode).toBe(200);
      parentPost = await Post.findById(newPost.body._id)
      expect(parentPost.comments).not.toContain(newComment.body._id)
    })
  })
  test("Should return 404 if comment not found", async () => {
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
    // Delete comment
    const deleteComment = await request(app)
      .delete(`/api/comments/5509f07f227cde6d205a0962`)
      .send({ parentId: newPost.body._id })
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(deleteComment.statusCode).toBe(404)
  })
  test("Should return 400 if parentId is missing from request body", async () => {
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
    // Delete comment
    const deleteComment = await request(app)
      .delete(`/api/comments/${newComment.body._id}`)
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(deleteComment.statusCode).toBe(400);
  })
})
