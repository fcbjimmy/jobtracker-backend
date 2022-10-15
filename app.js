require("dotenv").config();
require("express-async-errors");

//express
const express = require("express");
const app = express();

//extra packages/security packages
const cors = require("cors");

const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

//db
const connectDB = require("./db/connectDB");

//routers
const authRouter = require("./routes/authRoutes");
const userRouter = require("./routes/userRoutes");
const jobRouter = require("./routes/jobRoutes");

//middleware
// const cookieParser = require("cookie-parser");
const notFound = require("./middleware/not-found");
const errorHandlerMiddleware = require("./middleware/error-handler");

//routers
app.use(cors());
// app.use(cookieParser(process.env.JWT_SECRET));
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.get("/", (req, res) => {
  res.send("hello world");
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/v1/jobs", jobRouter);

app.use(errorHandlerMiddleware);
app.use(notFound);

//routes

//port
const port = process.env.PORT || 4000;
//initialize server

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URL);
    app.listen(port, console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
