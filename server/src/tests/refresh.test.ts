import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it } from "@jest/globals";
const request = require("supertest");
import { connect, disconnect, reset } from "./config/database";
import jwt from "jsonwebtoken";
import app from "../app"; // Adjust to where your Express app is exported
import User from "../models/User";

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await reset();
});

afterAll(async () => {
  await disconnect();
});

describe("Refresh Token Controller", () => {
  const userData = {
    fullname: "test fullname",
    username: "testuser123",
    password: "password123",
  };

  it("Should return 401 if no refresh token cookie is provided", async () => {
    const res = await request(app).get("/api/refresh");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  it("Should return 403 if refresh token is not found in DB", async () => {
    const fakeToken = jwt.sign({ userId: "fakeId" }, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: "7d",
    });

    const res = await request(app)
      .get("/api/refresh")
      .set("Cookie", [`jwt=${fakeToken}`]);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Forbidden");
  });

  it("Should return 403 if token is invalid or user ID mismatch", async () => {
    // Create and save a user
    const newUser = new User(userData);
    newUser.refreshToken = "sometoken";
    await newUser.save();

    const invalidToken = jwt.sign({ userId: "invalidId" }, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: "7d",
    });

    const res = await request(app)
      .get("/api/refresh")
      .set("Cookie", [`jwt=${invalidToken}`]);

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Forbidden");
  });

  it("Should return new access token if refresh token is valid", async () => {
    const user = new User(userData);
    const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET!, {
      expiresIn: "7d",
    });
    user.refreshToken = refreshToken;
    await user.save();

    const res = await request(app)
      .get("/api/refresh")
      .set("Cookie", [`jwt=${refreshToken}`]);

    expect(res.statusCode).toBe(200);
    expect(res.body.accessToken).toBeDefined();

    // Optional: Verify the returned token is valid
    const decoded = jwt.verify(res.body.accessToken, process.env.ACCESS_TOKEN_SECRET!);
    expect((decoded as any).userId).toBe(user._id.toString());
  });
});
