var express = require("express");
var router = express.Router();
const ObjectID = require("mongodb").ObjectID;

//GET the home page
router.get("/", (req, res) => {
  const opinions = res.locals.opinions;
  opinions
    .aggregate([{ $sample: { size: 5 } }])
    .toArray()
    .then((results) => {
      res.render("home", {
        title: "The Opinion Database",
        entries: results,
      });
    })
    .catch((error) => console.error(error));
});

//GET the create page
router.get("/create", (req, res) => {
  const opinions = res.locals.opinions;
  opinions
    .aggregate([{ $sample: { size: 5 } }])
    .toArray()
    .then((results) => {
      res.render("create", {
        title: "Create",
        entries: results,
      });
    })
    .catch((error) => console.error());
});

//POST opinion to database
router.post("/create", (req, res) => {
  const opinions = res.locals.opinions;
  opinions
    .insertOne({
      first: req.body.firstName.toString(),
      last: req.body.lastName.toString(),
      opinion: req.body.opinion.toString(),
    })
    .then((result) => {
      // console.log(result);
    })
    .catch((error) => {
      console.error(error);
    });
  res.redirect("/");
});

//GET delete page
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

//POST a request to delete a post
router.post("/delete", (req, res) => {
  const opinions = res.locals.opinions;
  opinions
    .deleteOne({ _id: ObjectID(req.body.deleteID.toString()) })
    .then((result) => {
      if (result.ok) {
        res.redirect("/delete");
      }
    })
    .catch((error) => console.log(error));
  res.redirect("/delete");
});

//GET the read page
router.get("/read", (req, res) => {
  const opinions = res.locals.opinions;
  opinions
    .aggregate([{ $sample: { size: 50 } }])
    .toArray()
    .then((results) => {
      res.render("read", { title: "Read", entries: results });
    })
    .catch((error) => console.error(error));
});

//POST the filters to the read page

//GET the update page
router.get("/update", (req, res) => {
  res.render("update", {
    title: "Update",
  });
});

//POST an update to an opinion
router.post("/update", (req, res) => {
  const opinions = res.locals.opinions;
  opinions
    .updateOne(
      { _id: ObjectID(req.body.updateID) },
      {
        $set: {
          first: req.body.firstName.toString(),
          last: req.body.lastName.toString(),
          opinion: req.body.opinion.toString(),
        },
      }
    )
    .then((results) => {
      res.render("update", {
        title: "Update",
        entries: results,
      });
    })
    .catch((error) => console.error(error));
});

module.exports = router;
