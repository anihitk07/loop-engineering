import express from "express";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const { version } = require("../package.json");

const app = express();

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/version", (_req, res) => {
  res.status(200).json({ version });
});

export default app;
