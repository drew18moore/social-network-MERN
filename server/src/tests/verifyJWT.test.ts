import { describe, expect, it } from "@jest/globals";
const request = require("supertest");
import express from "express";
import jwt from "jsonwebtoken";
import { verifyJWT } from "../middleware/verifyJWT";

// Setup env secret (in test environment this should match what's used to sign the token)
process.env.ACCESS_TOKEN_SECRET = "test-secret";

// Dummy route to verify middleware allows access
const app = express();
app.use(express.json());
app.get("/protected", verifyJWT, (req, res) => {
  res.status(200).json({ message: "Access granted", userId: req.userId });
});

describe("verifyJWT Middleware", () => {
  it("should return 401 if Authorization header is missing", async () => {
    const res = await request(app).get("/protected");
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Unauthorized");
  });

  it("should return 403 if token is invalid", async () => {
    const res = await request(app)
      .get("/protected")
      .set("Authorization", "Bearer invalidtoken");

    expect(res.statusCode).toBe(403);
    expect(res.body.message).toBe("Invalid token");
  });

  it("should allow access with a valid token", async () => {
    const validToken = jwt.sign({ userId: "user123" }, process.env.ACCESS_TOKEN_SECRET!, {
      expiresIn: "1h",
    });

    const res = await request(app)
      .get("/protected")
      .set("Authorization", `Bearer ${validToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.message).toBe("Access granted");
    expect(res.body.userId).toBe("user123");
  });
});
