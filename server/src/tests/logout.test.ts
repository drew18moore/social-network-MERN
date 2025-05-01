import { afterAll, afterEach, beforeAll, describe, expect, test } from "@jest/globals";
const request = require("supertest");
import app from "../app";
import { connect, disconnect, reset } from "./config/database";
import User from "../models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

beforeAll(async () => {
  await connect();
});

afterEach(async () => {
  await reset();
});

afterAll(async () => {
  await disconnect();
});

describe("GET /logout", () => {
  describe("On successful logout should return 204 status code and...", () => {
    test("Should clear the cookie", async () => {
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
      let cookies = registeredUser.headers["set-cookie"];
      expect(cookies).toBeDefined();
      const logoutRes = await request(app).get("/api/logout");
      expect(logoutRes.statusCode).toBe(204);

      cookies = logoutRes.headers["set-cookie"];
      expect(cookies).toBeUndefined();
    });
    test("Should delete refresh token from db", async () => {
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
      const user = await User.findById(registeredUser.body._id).select("refreshToken").lean();
      expect(user?.refreshToken).toBeDefined();
      // Extract cookie from registration response
  const cookie = registeredUser.headers["set-cookie"]?.find((c: string) => c.startsWith("jwt="));
  expect(cookie).toBeDefined();

  // Send logout request with cookie
  const logoutRes = await request(app)
    .get("/api/logout")
    .set("Cookie", cookie);
      expect(logoutRes.statusCode).toBe(204);
      const updatedUser = await User.findById(registeredUser.body._id).select("refreshToken").lean();
      expect(updatedUser?.refreshToken).toBe("");
    });
  });
});