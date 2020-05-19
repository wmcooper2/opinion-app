var express = require("express");
var router = express.Router();
const ObjectID = require("mongodb").ObjectID;

/* GET home page. */
router.get("/", (req, res) => {
  const opinions = res.locals.opinions;
  opinions
    .find()
    .toArray()
    .then((results) => {
      console.log("Results: ", results);
      res.render("index", {
        title: "Create",
        entries: results,
      });
    })
    .catch((error) => console.error());
});

router.post("/", (req, res) => {
  const opinions = res.locals.opinions;
  opinions
    .insertOne({
      first: req.body.firstName,
      last: req.body.lastName,
      opinion: req.body.opinion,
    })
    .then((result) => {
      console.log(result);
    })
    .catch((error) => {
      console.error(error);
    });
  res.redirect("/");
});

router.get("/delete", function (req, res, next) {
  const opinions = res.locals.opinions;
  opinions
    .find()
    .toArray()
    .then((results) => {
      res.render("delete", {
        title: "Delete",
        entries: results,
      });
    })
    .catch((error) => console.error(error));
});

router.post("/removepost", (req, res, next) => {
  let opinions = res.locals.opinions;
  opinions
    .deleteOne({ _id: ObjectID(req.body.deleteID) })
    .then((result) => {
      if (result.ok) {
        console.log("Deleted: ", result);
        res.redirect("/");
      }
    })
    .catch((error) => console.log(error));
  res.redirect("/delete");
});

router.get("/read", (req, res) => {
  res.render("read", { title: "Read" });
});

router.get("/update", (req, res) => {
  res.render("update", {
    title: "Update",
  });
});

module.exports = router;
