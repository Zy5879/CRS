import express from "express";
import cors from "cors";
import {
  customerSignInRouter,
  customerSignUpRouter,
} from "./customerAuthRoutes/customerAuthRoutes";

const port = 8000;

const app = express();
app.use(cors());
app.use(express.json());
app.use("/customerAuth", customerSignInRouter, customerSignUpRouter);

app.get("/", (_req, res) => {
  res.send("Welcome");
});

app.listen(port, () => {
  console.log(`Starting server on port ${port}`);
});
