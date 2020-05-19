const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const bodyParser = require("body-parser");
const app = express();
const dotenv = require("dotenv").config();

const MongoClient = require("mongodb").MongoClient;

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

MongoClient.connect(process.env.MONGO_DB, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected to Database.");
    const db = client.db("Cluster0");
    const opinions = db.collection("opinions");

    app.use((req, res, next) => {
      res.locals.opinions = opinions;
      next();
    });
    app.use("/", indexRouter);

    // catch 404 and forward to error handler
    app.use((req, res, next) => {
      next(createError(404));
    });

    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = req.app.get("env") === "development" ? err : {};

      // render the error page
      res.status(err.status || 500);
      res.render("error");
    });

    app.listen(3000, () => console.log("Listening on 3000..."));
  })
  .catch((error) => {
    console.error(error);
  });

module.exports = app;
