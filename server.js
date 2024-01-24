import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
const app = express();
const PORT = process.env.PORT || 8000;

//connect DB
import { connectDb } from "./src/config/mongoConfig.js";
connectDb();

import path from "path";

const __dirname = path.resolve();

// middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));

// server static files

app.use(express.static(path.join(__dirname, "/public")));

import userRouter from "./src/routers/userRouter.js";
import categoryRouter from "./src/routers/categoryRouter.js";

import productRouter from "./src/routers/ProductRouter.js";
import { adminAuth } from "./src/middlewares/authMiddleware.js";

// local middleware
app.use("/api/v1/users", userRouter);
app.use("/api/v1/categories", adminAuth, categoryRouter);

app.use("/api/v1/products", adminAuth, productRouter);

app.get("/", (req, res) => {
  res.json({
    status: "success",
    message: "server is live",
  });
});

app.use((error, req, res, next) => {
  console.log(error);
  const errorCode = error.errorCode || 500;

  res.status(errorCode).json({
    status: "error",
    message: error.message,
  });
});

app.listen(PORT, (error) => {
  error
    ? console.log(error)
    : console.log(`Server is running at http://localhost:${PORT}`);
});
