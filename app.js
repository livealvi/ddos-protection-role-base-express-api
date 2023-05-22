const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const morganMiddleware = require("./middleware/morgan.middleware");
const logger = require("./utils/logger");
const passport = require("passport");
const helmet = require("helmet");
const mongoose = require("mongoose");
require("dotenv").config();
require("./middleware/passport");

const app = express();

// port
const PORT = process.env.PORT || 3080;

const {
  notFoundHandler,
  errorOccurHandler,
} = require("./middleware/errorHandler");

// middleware
app.use(helmet());
app.use(morganMiddleware);
app.use(morgan("dev"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// database config
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.log(error));
db.once("open", () => console.log("Database connection successfully"));

// api testing
app.get("/", (req, res) => {
  logger.info("Checking the API status: Everything is OK");
  res.json({
    status: "200 UP 🌎",
    message: "API is up and running! 🏃‍♂️🚀",
  });
});

// public route
// auth
const auth = require("./routers/auth/auth");
app.use("/api/auth", auth);

// page
const page = require("./routers/page/page");
app.use("/api/page", page);

// protected route
// all router are secure from here
app.use(passport.initialize());
app.use(passport.authenticate("jwt", { session: false }));

// user
const user = require("./routers/user/user");
app.use("/api/user", user);

// tag
const tag = require("./routers/tag/tag");
app.use("/api/tag", tag);

// role
const role = require("./routers/role/role");
app.use("/api/role", role);

// tile
const tile = require("./routers/tile/tile");
app.use("/api/tile", tile);

// color
const color = require("./routers/color/color");
app.use("/api/color", color);

// badge
const badge = require("./routers/badge/bagde");
app.use("/api/badge", badge);

// 404 not found
app.use(notFoundHandler);
// error
app.use(errorOccurHandler);

// server
app.listen(PORT, () => {
  console.log(`server is running port ${PORT}`);
});
