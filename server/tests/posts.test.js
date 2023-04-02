const request = require("supertest");
const app = require("../app");
const Post = require("../models/Post");
const User = require("../models/User");
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
        profilePicture: "/default-pfp.jpg",
      };
      Object.keys(expectedData).forEach((field) => {
        if (typeof newPost.body[field] === "string") {
          expect(newPost.body[field]).toMatch(expectedData[field]);
        } else {
          expect(JSON.stringify(newPost.body[field])).toMatch(
            JSON.stringify(expectedData[field])
          );
        }
      });
    });
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
  });
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
  });
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
    expect(getPostById.statusCode).toBe(200);
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
      isBookmarked: false,
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
  });
  test("Should respond with 404 status code if provided postId doesn't exist", async () => {
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
    // Get post by id
    const getPostById = await request(app)
      .get(`/api/posts/5509f07f227cde6d205a0962`)
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(getPostById.statusCode).toBe(404);
  });
});

describe("PUT /posts/:id", () => {
  describe("On success, return 200 status code and...", () => {
    test("Should save updated post in db", async () => {
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
      let post = await Post.findById(newPost.body._id);
      expect(post.postBody).toBe(postBody);
      const updatedPostBody = "Updated post";
      const updatedPost = await request(app)
        .put(`/api/posts/${newPost.body._id}`)
        .send({ postBody: updatedPostBody })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(updatedPost.statusCode).toBe(200);
      post = await Post.findById(newPost.body._id);
      expect(post.postBody).toBe(updatedPostBody);
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
      const updatedPostBody = "Updated post";
      const updatedPost = await request(app)
        .put(`/api/posts/${newPost.body._id}`)
        .send({ postBody: updatedPostBody })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(updatedPost.statusCode).toBe(200);
      const expectedData = {
        _id: newPost.body._id,
        postBody: updatedPostBody,
      };
      Object.keys(expectedData).forEach((field) => {
        expect(updatedPost.body[field]).toMatch(expectedData[field]);
      });
    });
  });
  test("Should respond with 404 status code if post doesn't exist", async () => {
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
    const updatedPostBody = "Updated post";
    const updatedPost = await request(app)
      .put(`/api/posts/5509f07f227cde6d205a0962`)
      .send({ postBody: updatedPostBody })
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(updatedPost.statusCode).toBe(404);
  });
  test("Should respond with 403 if user tries to edit someone elses post", async () => {
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
      .set("Authorization", `Bearer ${registeredUser2.body.accessToken}`);
    expect(newPost.statusCode).toBe(200);
    const updatedPostBody = "Updated post";
    const updatedPost = await request(app)
      .put(`/api/posts/${newPost.body._id}`)
      .send({ postBody: updatedPostBody })
      .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
    expect(updatedPost.statusCode).toBe(403);
  });
});

describe("DELETE /posts/:id", () => {
  describe("On success return 200 status code and...", () => {
    test("Should delete post from db", async () => {
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
      // New post
      const postBody = "Post 1";
      const newPost = await request(app)
        .post("/api/posts/new")
        .send({ postBody: postBody })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(newPost.statusCode).toBe(200);
      let post = await Post.findById(newPost.body._id);
      expect(post).toBeTruthy();
      // Delete post
      const deletePost = await request(app)
        .delete(`/api/posts/${newPost.body._id}`)
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(deletePost.statusCode).toBe(200);
      post = await Post.findById(newPost.body._id);
      expect(post).not.toBeTruthy();
    });
    test("Should remove postId from other users' bookmarks list", async () => {
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
      // New post
      const postBody = "Post 1";
      const newPost = await request(app)
        .post("/api/posts/new")
        .send({ postBody: postBody })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(newPost.statusCode).toBe(200);
      // Bookmark post
      const bookmarkPost = await request(app)
        .put(`/api/posts/${newPost.body._id}/bookmark`)
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(bookmarkPost.statusCode).toBe(200);
      let user = await User.findById(registeredUser.body._id);
      expect(user.bookmarks).toContain(newPost.body._id);
      // Delete post
      const deletePost = await request(app)
        .delete(`/api/posts/${newPost.body._id}`)
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(deletePost.statusCode).toBe(200);
      user = await User.findById(registeredUser.body._id);
      expect(user.bookmarks).not.toContain(newPost.body._id);
    });
    test("Should remove comments on post", async () => {
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
      // New post
      const postBody = "Post 1";
      const newPost = await request(app)
        .post("/api/posts/new")
        .send({ postBody: postBody })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(newPost.statusCode).toBe(200);
      // Comment on post
      const commentBody = "New comment";
      const newComment = await request(app)
        .post(`/api/comments/new`)
        .send({ parentId: newPost.body._id, commentBody: commentBody })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(newComment.statusCode).toBe(200);
      let comment = await Comment.findById(newComment.body._id);
      expect(comment).toBeTruthy();
      // Delete post
      const deletePost = await request(app)
        .delete(`/api/posts/${newPost.body._id}`)
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(deletePost.statusCode).toBe(200);
      comment = await Comment.findById(newComment.body._id);
      expect(comment).not.toBeTruthy();
    });
  });
  test("Should return 412 if post's userId doen't match auth user's id", async () => {
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
    // New post
    const postBody = "Post 1";
    const newPost = await request(app)
      .post("/api/posts/new")
      .send({ postBody: postBody })
      .set("Authorization", `Bearer ${registeredUser2.body.accessToken}`);
    expect(newPost.statusCode).toBe(200);
    const deletePost = await request(app)
      .delete(`/api/posts/${newPost.body._id}`)
      .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
    expect(deletePost.statusCode).toBe(412);
  });
  test("Should return 404 if post isn't found", async () => {
    // Register user
    const userData1 = {
      fullname: "test fullname",
      username: "testusername1",
      password: "password123",
    };
    const registeredUser = await request(app)
      .post("/api/auth/register")
      .send(userData1);
    expect(registeredUser.statusCode).toBe(200);
    const deletePost = await request(app)
      .delete(`/api/posts/5509f07f227cde6d205a0962`)
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(deletePost.statusCode).toBe(404);
  });
});

describe("PUT /posts/:id/like", () => {
  describe("On success return 200 status code and...", () => {
    test("Should ADD user's id to post's likes if previously unliked", async () => {
      // Register user
      const userData1 = {
        fullname: "test fullname",
        username: "testusername1",
        password: "password123",
      };
      const registeredUser = await request(app)
        .post("/api/auth/register")
        .send(userData1);
      expect(registeredUser.statusCode).toBe(200);
      // New post
      const postBody = "Post 1";
      const newPost = await request(app)
        .post("/api/posts/new")
        .send({ postBody: postBody })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(newPost.statusCode).toBe(200);
      let post = await Post.findById(newPost.body._id);
      expect(post.likes).not.toContain(registeredUser.body._id);
      const likePost = await request(app)
        .put(`/api/posts/${newPost.body._id}/like`)
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(likePost.statusCode).toBe(200);
      post = await Post.findById(newPost.body._id);
      expect(post.likes).toContain(registeredUser.body._id);
    });
    test("Should REMOVE user's id to post's likes if previously liked", async () => {
      // Register user
      const userData1 = {
        fullname: "test fullname",
        username: "testusername1",
        password: "password123",
      };
      const registeredUser = await request(app)
        .post("/api/auth/register")
        .send(userData1);
      expect(registeredUser.statusCode).toBe(200);
      // New post
      const postBody = "Post 1";
      const newPost = await request(app)
        .post("/api/posts/new")
        .send({ postBody: postBody })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(newPost.statusCode).toBe(200);
      // Like post
      const likePost = await request(app)
        .put(`/api/posts/${newPost.body._id}/like`)
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(likePost.statusCode).toBe(200);
      let post = await Post.findById(newPost.body._id);
      expect(post.likes).toContain(registeredUser.body._id);
      // Unlike post
      const unlikePost = await request(app)
        .put(`/api/posts/${newPost.body._id}/like`)
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(unlikePost.statusCode).toBe(200);
      post = await Post.findById(newPost.body._id);
      expect(post.likes).not.toContain(registeredUser.body._id);
    });
    test("Should return correct json data if post is liked", async () => {
      // Register user
      const userData1 = {
        fullname: "test fullname",
        username: "testusername1",
        password: "password123",
      };
      const registeredUser = await request(app)
        .post("/api/auth/register")
        .send(userData1);
      expect(registeredUser.statusCode).toBe(200);
      // New post
      const postBody = "Post 1";
      const newPost = await request(app)
        .post("/api/posts/new")
        .send({ postBody: postBody })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(newPost.statusCode).toBe(200);
      // Like post
      const likePost = await request(app)
        .put(`/api/posts/${newPost.body._id}/like`)
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(likePost.statusCode).toBe(200);
      const expectedData = {
        message: "Post has been liked",
        numLikes: 1,
      };
      Object.keys(expectedData).forEach((field) => {
        expect(JSON.stringify(likePost.body[field])).toMatch(
          JSON.stringify(expectedData[field])
        );
      });
    });
    test("Should return correct json data if post is unliked", async () => {
      // Register user
      const userData1 = {
        fullname: "test fullname",
        username: "testusername1",
        password: "password123",
      };
      const registeredUser = await request(app)
        .post("/api/auth/register")
        .send(userData1);
      expect(registeredUser.statusCode).toBe(200);
      // New post
      const postBody = "Post 1";
      const newPost = await request(app)
        .post("/api/posts/new")
        .send({ postBody: postBody })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(newPost.statusCode).toBe(200);
      // Like post
      const likePost = await request(app)
        .put(`/api/posts/${newPost.body._id}/like`)
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(likePost.statusCode).toBe(200);
      const unlikePost = await request(app)
        .put(`/api/posts/${newPost.body._id}/like`)
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(unlikePost.statusCode).toBe(200);
      const expectedData = {
        message: "Post has been unliked",
        numLikes: 0,
      };
      Object.keys(expectedData).forEach((field) => {
        expect(JSON.stringify(unlikePost.body[field])).toMatch(
          JSON.stringify(expectedData[field])
        );
      });
    });
  });
  test("Should respond with a 404 status code if the post is not found", async () => {
    // Register user
    const userData1 = {
      fullname: "test fullname",
      username: "testusername1",
      password: "password123",
    };
    const registeredUser = await request(app)
      .post("/api/auth/register")
      .send(userData1);
    expect(registeredUser.statusCode).toBe(200);
    // Like post
    const likePost = await request(app)
      .put(`/api/posts/5509f07f227cde6d205a0962/like`)
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(likePost.statusCode).toBe(404);
  });
});

describe("PUT /posts/:id/bookmark", () => {
  describe("On success return 200 status code and...", () => {
    test("Should ADD post's id to user's bookmarks if previously unbookmarked", async () => {
      // Register user
      const userData1 = {
        fullname: "test fullname",
        username: "testusername1",
        password: "password123",
      };
      const registeredUser = await request(app)
        .post("/api/auth/register")
        .send(userData1);
      expect(registeredUser.statusCode).toBe(200);
      // New post
      const postBody = "Post 1";
      const newPost = await request(app)
        .post("/api/posts/new")
        .send({ postBody: postBody })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(newPost.statusCode).toBe(200);
      let user = await User.findById(registeredUser.body._id);
      expect(user.bookmarks).not.toContain(newPost.body._id);
      // Bookmark post
      const bookmarkPost = await request(app)
        .put(`/api/posts/${newPost.body._id}/bookmark`)
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(bookmarkPost.statusCode).toBe(200)
      user = await User.findById(registeredUser.body._id);
      expect(user.bookmarks).toContain(newPost.body._id);
    });
  });
});
