import { describe, expect, it } from "@jest/globals";
const request = require("supertest");
import express from "express";
import { credentials } from "../middleware/credentials";
import { allowedOrigins } from "../config/allowedOrigins";

// Create a minimal app for testing middleware
const app = express();
app.use(credentials);
app.get("/test", (req, res) => res.send("ok"));

describe("Credentials Middleware", () => {
  it("Should set Access-Control-Allow-Credentials header for allowed origin", async () => {
    const res = await request(app)
      .get("/test")
      .set("Origin", allowedOrigins[0]);

    expect(res.headers["access-control-allow-credentials"]).toBe("true");
  });

  it("Should NOT set Access-Control-Allow-Credentials header for disallowed origin", async () => {
    const res = await request(app)
      .get("/test")
      .set("Origin", "http://disallowed-origin.com");

    expect(res.headers["access-control-allow-credentials"]).toBeUndefined();
  });

  it("Should NOT set header if Origin is missing", async () => {
    const res = await request(app).get("/test");

    expect(res.headers["access-control-allow-credentials"]).toBeUndefined();
  });
});
