import { describe, it, expect } from "vitest";
import request from "supertest";
import app from "../src/app.js";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

describe("GET /version", () => {
  it("returns 200 with { version }", async () => {
    const res = await request(app).get("/version");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ version });
  });

  it("version is a valid semver string", async () => {
    const res = await request(app).get("/version");
    expect(res.body.version).toMatch(/^\d+\.\d+\.\d+/);
  });
});
