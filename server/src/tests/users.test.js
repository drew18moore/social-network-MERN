const jwt = require("jsonwebtoken");
const request = require("supertest");
const app = require("../app");
const Post = require("../models/Post");
const User = require("../models/User");
const Comment = require("../models/Comment");
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

  test("If userId in req.userId doesn't match id in params, return 403 status code", async () => {
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
      userId: "987654321",
      fullname: "new fullname",
      username: "newusername",
      bio: "new bio",
      password: "password123",
    };
    const updatedUser = await request(app)
      .put(`/api/users/123456789`)
      .send(updates)
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
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
  test("If user doesn't exist, respond with a 404 status code", async () => {
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
    expect(response.statusCode).toBe(404);
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
      .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
    expect(response.statusCode).toBe(200);
    let user1 = await User.findById(registeredUser1.body._id);
    let user2 = await User.findById(registeredUser2.body._id);
    expect(user1.following).toContain(user2._id.toString());
    expect(user2.followers).toContain(user1._id.toString());
    // Unfollow user
    const response2 = await request(app)
      .put(`/api/users/follow/${userData2.username}`)
      .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
    expect(response2.statusCode).toBe(200);
    user1 = await User.findById(registeredUser1.body._id);
    user2 = await User.findById(registeredUser2.body._id);
    expect(user1.following).not.toContain(user2._id.toString());
    expect(user2.followers).not.toContain(user1._id.toString());
  });
  test("If username in req.params and username from req.userId match, return 403 status code", async () => {
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
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(response.statusCode).toBe(403);
  });
  test("If username in req.params doesn't exist, return 404 status code", async () => {
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
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(response.statusCode).toBe(404);
  });
});

describe("GET /users/all-unfollowed/:id", () => {
  describe("On success, return 200 status code. Should respond with correct json data.", () => {
    test("When are no users that the user isn't following, the correct json data is sent", async () => {
      // Create main user
      const userData1 = {
        fullname: "test fullname",
        username: "testusername",
        password: "password123",
      };
      const registeredUser1 = await request(app)
        .post("/api/auth/register")
        .send(userData1);
      expect(registeredUser1.statusCode).toBe(200);
      // Create user to follow
      const userData2 = {
        fullname: "test fullname",
        username: "testusername2",
        password: "password123",
      };
      const registeredUser2 = await request(app)
        .post("/api/auth/register")
        .send(userData2);
      expect(registeredUser2.statusCode).toBe(200);
      // Follow user
      const followUserResponse = await request(app)
        .put(`/api/users/follow/${userData2.username}`)
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(followUserResponse.statusCode).toBe(200);
      let user1 = await User.findById(registeredUser1.body._id);
      let user2 = await User.findById(registeredUser2.body._id);
      expect(user1.following).toContain(user2._id.toString());
      expect(user2.followers).toContain(user1._id.toString());
      // Get unfollowed users
      const response = await request(app)
        .get(`/api/users/all-unfollowed/${registeredUser1.body._id}`)
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(response.statusCode).toBe(200);
      expectedData = {
        numFound: 0,
        unfollowedUsers: [],
      };
      Object.keys(expectedData).forEach((field) => {
        expect(JSON.stringify(response.body[field])).toMatch(
          JSON.stringify(expectedData[field])
        );
      });
    });
    test("When user is following one of the users, the correct json data is sent", async () => {
      // Create main user
      const userData1 = {
        fullname: "test fullname",
        username: "testusername",
        password: "password123",
      };
      const registeredUser1 = await request(app)
        .post("/api/auth/register")
        .send(userData1);
      expect(registeredUser1.statusCode).toBe(200);
      // Create user to follow
      const userData2 = {
        fullname: "test fullname",
        username: "testusername2",
        password: "password123",
      };
      const registeredUser2 = await request(app)
        .post("/api/auth/register")
        .send(userData2);
      expect(registeredUser2.statusCode).toBe(200);
      // Create third user
      const userData3 = {
        fullname: "test fullname",
        username: "testusername3",
        password: "password123",
      };
      const registeredUser3 = await request(app)
        .post("/api/auth/register")
        .send(userData3);
      expect(registeredUser3.statusCode).toBe(200);
      // Follow user
      const followUserResponse = await request(app)
        .put(`/api/users/follow/${userData2.username}`)
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(followUserResponse.statusCode).toBe(200);
      let user1 = await User.findById(registeredUser1.body._id);
      let user2 = await User.findById(registeredUser2.body._id);
      expect(user1.following).toContain(user2._id.toString());
      expect(user2.followers).toContain(user1._id.toString());
      // Get unfollowed users
      const response = await request(app)
        .get(`/api/users/all-unfollowed/${registeredUser1.body._id}`)
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(response.statusCode).toBe(200);
      expectedData = {
        numFound: 1,
        unfollowedUsers: [
          {
            _id: registeredUser3.body._id,
            fullname: registeredUser3.body.fullname,
            username: registeredUser3.body.username,
            img: registeredUser3.body.img || "/default-pfp.jpg",
          },
        ],
      };
      Object.keys(expectedData).forEach((field) => {
        expect(JSON.stringify(response.body[field])).toMatch(
          JSON.stringify(expectedData[field])
        );
      });
    });
  });
  test("if user from req.params.id doesn't exist, return 404 status code", async () => {
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
      .get(`/api/users/all-unfollowed/5509f07f227cde6d205a0962`)
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(response.statusCode).toBe(404);
  });
});

describe("GET /users/:username/following", () => {
  describe("On success, return 200 status and correct json data", () => {
    test("If user ISN'T following anyone return correct json data", async () => {
      // Register main user
      const userData1 = {
        fullname: "test fullname",
        username: "testusername",
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
      // Get followed users
      const response = await request(app)
        .get(`/api/users/${registeredUser1.body.username}/following`)
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(response.statusCode).toBe(200);
      expectedData = {
        user: {
          fullname: registeredUser1.body.fullname,
          username: registeredUser1.body.username,
        },
        numFound: 0,
        following: [],
      };
      Object.keys(expectedData).forEach((field) => {
        expect(JSON.stringify(response.body[field])).toMatch(
          JSON.stringify(expectedData[field])
        );
      });
    });
    test("If user IS following anyone return correct json data", async () => {
      // Register main user
      const userData1 = {
        fullname: "test fullname",
        username: "testusername",
        password: "password123",
      };
      const registeredUser1 = await request(app)
        .post("/api/auth/register")
        .send(userData1);
      expect(registeredUser1.statusCode).toBe(200);
      // Register user to follow
      const userData2 = {
        fullname: "test fullname",
        username: "testusername2",
        password: "password123",
      };
      const registeredUser2 = await request(app)
        .post("/api/auth/register")
        .send(userData2);
      expect(registeredUser2.statusCode).toBe(200);
      // Follow user
      const followUserResponse = await request(app)
        .put(`/api/users/follow/${userData2.username}`)
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(followUserResponse.statusCode).toBe(200);
      let user1 = await User.findById(registeredUser1.body._id);
      let user2 = await User.findById(registeredUser2.body._id);
      expect(user1.following).toContain(user2._id.toString());
      expect(user2.followers).toContain(user1._id.toString());
      // Get followed users
      const response = await request(app)
        .get(`/api/users/${registeredUser1.body.username}/following`)
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(response.statusCode).toBe(200);
      expectedData = {
        user: {
          fullname: registeredUser1.body.fullname,
          username: registeredUser1.body.username,
        },
        numFound: 1,
        following: [
          {
            _id: registeredUser2.body._id,
            fullname: registeredUser2.body.fullname,
            username: registeredUser2.body.username,
            img: registeredUser2.body.img || "/default-pfp.jpg",
            isFollowing: true,
          },
        ],
      };
      Object.keys(expectedData).forEach((field) => {
        expect(JSON.stringify(response.body[field])).toMatch(
          JSON.stringify(expectedData[field])
        );
      });
    });
  });
  test("if user from req.params.username doesn't exist, return 404 status code", async () => {
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
      .get(`/api/users/fakeusername/following`)
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(response.statusCode).toBe(404);
  });
});

describe("GET /users/:username/followers", () => {
  describe("On success, return 200 status and correct json data", () => {
    test("If user has NO followers return correct json data", async () => {
      // Register main user
      const userData1 = {
        fullname: "test fullname",
        username: "testusername",
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
      // Get followers
      const response = await request(app)
        .get(`/api/users/${registeredUser1.body.username}/followers`)
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(response.statusCode).toBe(200);
      expectedData = {
        user: {
          fullname: registeredUser1.body.fullname,
          username: registeredUser1.body.username,
        },
        numFound: 0,
        followers: [],
      };
      Object.keys(expectedData).forEach((field) => {
        expect(JSON.stringify(response.body[field])).toMatch(
          JSON.stringify(expectedData[field])
        );
      });
    });
    test("If user has followers return correct json data", async () => {
      // Register main user
      const userData1 = {
        fullname: "test fullname",
        username: "testusername",
        password: "password123",
      };
      const registeredUser1 = await request(app)
        .post("/api/auth/register")
        .send(userData1);
      expect(registeredUser1.statusCode).toBe(200);
      // Register user to follow
      const userData2 = {
        fullname: "test fullname",
        username: "testusername2",
        password: "password123",
      };
      const registeredUser2 = await request(app)
        .post("/api/auth/register")
        .send(userData2);
      expect(registeredUser2.statusCode).toBe(200);
      // Follow user
      const followUserResponse = await request(app)
        .put(`/api/users/follow/${userData1.username}`)
        .set("Authorization", `Bearer ${registeredUser2.body.accessToken}`);
      expect(followUserResponse.statusCode).toBe(200);
      let user1 = await User.findById(registeredUser1.body._id);
      let user2 = await User.findById(registeredUser2.body._id);
      expect(user1.followers).toContain(user2._id.toString());
      expect(user2.following).toContain(user1._id.toString());
      // Get followed users
      const response = await request(app)
        .get(`/api/users/${registeredUser1.body.username}/followers`)
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(response.statusCode).toBe(200);
      expectedData = {
        user: {
          fullname: registeredUser1.body.fullname,
          username: registeredUser1.body.username,
        },
        numFound: 1,
        followers: [
          {
            _id: registeredUser2.body._id,
            fullname: registeredUser2.body.fullname,
            username: registeredUser2.body.username,
            img: registeredUser2.body.img || "/default-pfp.jpg",
            isFollowing: false,
          },
        ],
      };
      Object.keys(expectedData).forEach((field) => {
        expect(JSON.stringify(response.body[field])).toMatch(
          JSON.stringify(expectedData[field])
        );
      });
    });
  });
  test("if user from req.params.username doesn't exist, return 404 status code", async () => {
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
      .get(`/api/users/fakeusername/followers`)
      .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
    expect(response.statusCode).toBe(404);
  });
});

describe("DELETE /users/delete/:userId", () => {
  describe("On success...", () => {
    test("...return 200 status code and remove user from database", async () => {
      // Register main user
      const userData = {
        fullname: "test fullname",
        username: "testusername",
        password: "password123",
      };
      const registeredUser = await request(app)
        .post("/api/auth/register")
        .send(userData);
      expect(registeredUser.statusCode).toBe(200);
      // Expect user to exists
      let user = await User.findById(registeredUser.body._id);
      expect(user).toBeTruthy();
      // Call DELETE endpoint
      const deleteUser = await request(app)
        .delete(`/api/users/delete/${registeredUser.body._id}`)
        .send({ password: userData.password })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(deleteUser.statusCode).toBe(200);
      // Expect user to not exist
      user = await User.findById(registeredUser.body._id);
      expect(user).not.toBeTruthy();
    });
    test("...return 200 status code and remove user's own posts from database", async () => {
      // Register main user
      const userData = {
        fullname: "test fullname",
        username: "testusername",
        password: "password123",
      };
      const registeredUser = await request(app)
        .post("/api/auth/register")
        .send(userData);
      expect(registeredUser.statusCode).toBe(200);
      // Create first post
      const postBody = "Post 1";
      const newPost1 = await request(app)
        .post("/api/posts/new")
        .send({ postBody: postBody })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(newPost1.statusCode).toBe(200);
      let post1 = await Post.findById(newPost1.body._id);
      expect(post1).toBeTruthy();
      // Create second post
      const postBody2 = "Post 2";
      const newPost2 = await request(app)
        .post("/api/posts/new")
        .send({ postBody: postBody2 })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(newPost2.statusCode).toBe(200);
      let post2 = await Post.findById(newPost2.body._id);
      expect(post2).toBeTruthy();
      const deleteUser = await request(app)
        .delete(`/api/users/delete/${registeredUser.body._id}`)
        .send({ password: userData.password })
        .set("Authorization", `Bearer ${registeredUser.body.accessToken}`);
      expect(deleteUser.statusCode).toBe(200);
      post1 = await Post.findById(newPost1.body._id);
      expect(post1).not.toBeTruthy();
      post2 = await Post.findById(newPost2.body._id);
      expect(post2).not.toBeTruthy();
    });
    test("...return 200 status code and remove user's own comments from database", async () => {
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
      // Have second user create a post
      const postBody = "Post 1";
      const newPost = await request(app)
        .post("/api/posts/new")
        .send({ postBody: postBody })
        .set("Authorization", `Bearer ${registeredUser2.body.accessToken}`);
      expect(newPost.statusCode).toBe(200);
      let post1 = await Post.findById(newPost.body._id);
      expect(post1).toBeTruthy();
      // Have main user comments on second user's post
      // Create comment1
      const commentData1 = {
        userId: registeredUser1.body._id,
        parentId: newPost.body._id,
        commentBody: "Comment 1",
      };
      const newComment1 = await request(app)
        .post("/api/comments/new")
        .send(commentData1)
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(newComment1.statusCode).toBe(200);
      let comment1 = await Comment.findById(newComment1.body._id);
      expect(comment1).toBeTruthy();
      // Create comment2
      const commentData2 = {
        userId: registeredUser1.body._id,
        parentId: newPost.body._id,
        commentBody: "Comment 1",
      };
      const newComment2 = await request(app)
        .post("/api/comments/new")
        .send(commentData2)
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(newComment2.statusCode).toBe(200);
      let comment2 = await Comment.findById(newComment2.body._id);
      expect(comment2).toBeTruthy();
      const deleteUser = await request(app)
        .delete(`/api/users/delete/${registeredUser1.body._id}`)
        .send({ password: userData1.password })
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(deleteUser.statusCode).toBe(200);
      comment1 = await Comment.findById(newComment1.body._id);
      comment2 = await Comment.findById(newComment2.body._id);
      expect(comment1).not.toBeTruthy();
      expect(comment2).not.toBeTruthy();
    });
    test("...return 200 status code and remove comments on user's own posts from database", async () => {
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
      // Have main user create a post
      const postBody = "Post 1";
      const newPost = await request(app)
        .post("/api/posts/new")
        .send({ postBody: postBody })
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(newPost.statusCode).toBe(200);
      let post = await Post.findById(newPost.body._id);
      expect(post).toBeTruthy();
      // Have main user comment on their own posts
      const mainUserCommentData = {
        userId: registeredUser1.body._id,
        parentId: newPost.body._id,
        commentBody: "Comment 1",
      };
      const mainUserComment = await request(app)
        .post("/api/comments/new")
        .send(mainUserCommentData)
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(mainUserComment.statusCode).toBe(200);
      let comment1 = await Comment.findById(mainUserComment.body._id);
      expect(comment1).toBeTruthy();
      // Have second user comment on main user's posts
      const secondUserCommentData = {
        userId: registeredUser1.body._id,
        parentId: newPost.body._id,
        commentBody: "Comment 1",
      };
      const secondUserComment = await request(app)
        .post("/api/comments/new")
        .send(secondUserCommentData)
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(secondUserComment.statusCode).toBe(200);
      let comment2 = await Comment.findById(secondUserComment.body._id);
      expect(comment2).toBeTruthy();
      const deleteUser = await request(app)
        .delete(`/api/users/delete/${registeredUser1.body._id}`)
        .send({ password: userData1.password })
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(deleteUser.statusCode).toBe(200);
      comment1 = await Comment.findById(mainUserComment.body._id);
      comment2 = await Comment.findById(secondUserComment.body._id);
      expect(comment1).not.toBeTruthy();
      expect(comment2).not.toBeTruthy();
    });
    test("...return 200 status code and remove user's id from other users' followers list", async () => {
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
      // Have main user follow second user
      const followSecondUser = await request(app)
        .put(`/api/users/follow/${userData2.username}`)
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(followSecondUser.statusCode).toBe(200);
      let secondUser = await User.findById(registeredUser2.body._id);
      expect(secondUser.followers).toContain(registeredUser1.body._id);
      // Delete user
      const deleteUser = await request(app)
        .delete(`/api/users/delete/${registeredUser1.body._id}`)
        .send({ password: userData1.password })
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(deleteUser.statusCode).toBe(200);
      secondUser = await User.findById(registeredUser2.body._id);
      expect(secondUser.followers).not.toContain(registeredUser1.body._id);
    });
    test("...return 200 status code and remove user's id from other users' following list", async () => {
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
      // Have second user follow main user
      const followMainUser = await request(app)
        .put(`/api/users/follow/${userData1.username}`)
        .set("Authorization", `Bearer ${registeredUser2.body.accessToken}`);
      expect(followMainUser.statusCode).toBe(200);
      let secondUser = await User.findById(registeredUser2.body._id);
      expect(secondUser.following).toContain(registeredUser1.body._id);
      // Delete user
      const deleteUser = await request(app)
        .delete(`/api/users/delete/${registeredUser1.body._id}`)
        .send({ password: userData1.password })
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(deleteUser.statusCode).toBe(200);
      secondUser = await User.findById(registeredUser2.body._id);
      expect(secondUser.following).not.toContain(registeredUser1.body._id);
    });
    test("...return 200 status code and remove user's post ids from other users' bookmarks list", async () => {
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
      // Have main user create a post
      const postBody = "Post 1";
      const newPost = await request(app)
        .post("/api/posts/new")
        .send({ postBody: postBody })
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(newPost.statusCode).toBe(200);
      // Have second user bookmark post
      const bookmarkPost = await request(app)
        .put(`/api/posts/${newPost.body._id}/bookmark`)
        .set("Authorization", `Bearer ${registeredUser2.body.accessToken}`);
      expect(bookmarkPost.statusCode).toBe(200);
      let secondUser = await User.findById(registeredUser2.body._id);
      expect(secondUser.bookmarks).toContain(newPost.body._id);
      // Delete main user
      const deleteUser = await request(app)
        .delete(`/api/users/delete/${registeredUser1.body._id}`)
        .send({ password: userData1.password })
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(deleteUser.statusCode).toBe(200);
      secondUser = await User.findById(registeredUser2.body._id);
      expect(secondUser.bookmarks).not.toContain(newPost.body._id);
    });
    test("...return 200 status code and remove user's id from other users' post likes list", async () => {
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
      // Have second user create a post
      const postBody = "Post 1";
      const newPost = await request(app)
        .post("/api/posts/new")
        .send({ postBody: postBody })
        .set("Authorization", `Bearer ${registeredUser2.body.accessToken}`);
      expect(newPost.statusCode).toBe(200);
      // Have main user like posts
      const likePost = await request(app)
        .put(`/api/posts/${newPost.body._id}/like`)
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(likePost.statusCode).toBe(200);
      let post = await Post.findById(newPost.body._id);
      expect(post.likes).toContain(registeredUser1.body._id);
      // Delete main user
      const deleteUser = await request(app)
        .delete(`/api/users/delete/${registeredUser1.body._id}`)
        .send({ password: userData1.password })
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(deleteUser.statusCode).toBe(200);
      post = await Post.findById(newPost.body._id);
      expect(post.likes).not.toContain(registeredUser1.body._id);
    });
    test("...return 200 status code and remove user's id from other users' comment likes list", async () => {
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
      // Have second user create a post
      const postBody = "Post 1";
      const newPost = await request(app)
        .post("/api/posts/new")
        .send({ postBody: postBody })
        .set("Authorization", `Bearer ${registeredUser2.body.accessToken}`);
      expect(newPost.statusCode).toBe(200);
      // Have second user comment on their own post
      const newComment = await request(app)
        .post("/api/comments/new")
        .send({
          parentId: newPost.body._id,
          commentBody: "Comment 1",
        })
        .set("Authorization", `Bearer ${registeredUser2.body.accessToken}`);
      expect(newComment.statusCode).toBe(200);
      // Have main user like comments
      const likeComment = await request(app)
        .put(`/api/comments/${newComment.body._id}/like`)
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(likeComment.statusCode).toBe(200);
      let comment = await Comment.findById(newComment.body._id);
      expect(comment.likes).toContain(registeredUser1.body._id);
      // Delete main user
      const deleteUser = await request(app)
        .delete(`/api/users/delete/${registeredUser1.body._id}`)
        .send({ password: userData1.password })
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(deleteUser.statusCode).toBe(200);
      comment = await Comment.findById(newComment.body._id);
      expect(comment.likes).not.toContain(registeredUser1.body._id);
    });
  });
  test("If user doesn't exist, return 404 status code", async () => {
    const tempAccessToken = jwt.sign(
      { userId: "5509f07f227cde6d205a0962" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 900000 }
    );
    const deleteUser = await request(app)
      .delete(`/api/users/delete/5509f07f227cde6d205a0962`)
      .send({ password: "password123" })
      .set("Authorization", `Bearer ${tempAccessToken}`);
    expect(deleteUser.statusCode).toBe(404);
  });
  test("If password is incorrect, return 400 status code", async () => {
    const userData1 = {
      fullname: "test fullname",
      username: "testusername1",
      password: "password123",
    };
    const registeredUser1 = await request(app)
      .post("/api/auth/register")
      .send(userData1);
    expect(registeredUser1.statusCode).toBe(200);
    const deleteUser = await request(app)
      .delete(`/api/users/delete/${registeredUser1.body._id}`)
      .send({ password: "wrongpassword" })
      .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
    expect(deleteUser.statusCode).toBe(400);
  });
});

describe("GET /users/:id/bookmarks", () => {
  describe("On success...", () => {
    test("If user has NO bookmarks, return 200 status code and correct json data", async () => {
      // Register user
      const userData1 = {
        fullname: "test fullname",
        username: "testusername",
        password: "password123",
      };
      const registeredUser1 = await request(app)
        .post("/api/auth/register")
        .send(userData1);
      expect(registeredUser1.statusCode).toBe(200);
      // Get bookmarks
      const bookmarks = await request(app)
        .get(`/api/users/${registeredUser1.body._id}/bookmarks`)
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(bookmarks.statusCode).toBe(200);
      const expectedData = {
        numFound: 0,
        posts: [],
      };
      Object.keys(expectedData).forEach((field) => {
        expect(JSON.stringify(bookmarks.body[field])).toMatch(
          JSON.stringify(expectedData[field])
        );
      });
    });
    test("If user has bookmarks, return 200 status code and correct json data", async () => {
      // Register user
      const userData1 = {
        fullname: "test fullname",
        username: "testusername",
        password: "password123",
      };
      const registeredUser1 = await request(app)
        .post("/api/auth/register")
        .send(userData1);
      expect(registeredUser1.statusCode).toBe(200);
      // Create post
      const postBody = "Post 1";
      const newPost = await request(app)
        .post("/api/posts/new")
        .send({ postBody: postBody })
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(newPost.statusCode).toBe(200);
      // Bookmark post
      const bookmarkPost = await request(app)
        .put(`/api/posts/${newPost.body._id}/bookmark`)
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(bookmarkPost.statusCode).toBe(200);
      // Get bookmarks
      const bookmarks = await request(app)
        .get(`/api/users/${registeredUser1.body._id}/bookmarks?page=1&limit=5`)
        .set("Authorization", `Bearer ${registeredUser1.body.accessToken}`);
      expect(bookmarks.statusCode).toBe(200);
      const expectedData = {
        numFound: 1,
        posts: [
          {
            _id: newPost.body._id,
            userId: registeredUser1.body._id,
            postBody: newPost.body.postBody,
            likes: [],
            comments: [],
            createdAt: newPost.body.createdAt,
            fullname: registeredUser1.body.fullname,
            username: registeredUser1.body.username,
            profilePicture: "/default-pfp.jpg",
          },
        ],
      };
      Object.keys(expectedData).forEach((field) => {
        expect(JSON.stringify(bookmarks.body[field])).toMatch(
          JSON.stringify(expectedData[field])
        );
      });
    });
  });
  test("If user doesn't exist, return 404 status code", async () => {
    const tempAccessToken = jwt.sign(
      { userId: "5509f07f227cde6d205a0962" },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: 900000 }
    );
    // Get bookmarks
    const bookmarks = await request(app)
      .get(`/api/users/5509f07f227cde6d205a0962/bookmarks?page=1&limit=5`)
      .set("Authorization", `Bearer ${tempAccessToken}`);
    expect(bookmarks.statusCode).toBe(404);
  });
});
