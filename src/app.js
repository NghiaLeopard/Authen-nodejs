const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const compression = require("compression");
const CustomError = require("./utils/customErrorResponse");

const app = express();

// init middleware
app.use(morgan("dev"));
app.use(helmet());
app.use(compression());
app.use(express.json());

// init db
require("./db/connect.db");

// init route
app.use("/api/auth", require("./routers/authRouter"));

// init error global
app.all("*", (req, res, next) => {
    next(new CustomError(`Don not find ${req.originalUrl}`, 404));
});

app.use(require("./controllers/errorController"));

module.exports = app;
