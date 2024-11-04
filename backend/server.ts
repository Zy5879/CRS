import express from "express";
const port = 8000;

const app = express();

app.get("/", (_req, res) => {
  res.send("Welcome");
});

app.listen(port, () => {
  console.log(`Starting server on port ${port}`);
});
