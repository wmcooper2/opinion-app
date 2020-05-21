var express = require("express");
var router = express.Router();
const ObjectID = require("mongodb").ObjectID;

const opinionsDB = "The Opinions Database";

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
        siteName: opinionsDB,
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
        siteName: opinionsDB,
      });
    })
    .catch((error) => console.error());
});

//POST opinion to database
router.post("/create", (req, res) => {
  const opinions = res.locals.opinions;
  const postId = opinions
    .count({})
    .then((val) => {
      console.log("postId: ", val);
    })
    .catch((error) => console.error(error));
  opinions
    .insertOne({
      first: req.body.firstName.toString(),
      opinion: req.body.opinion.toString(),
    })
    .then((result) => {
      // nothing
    })
    .catch((error) => {
      console.error(error);
    });
  res.redirect("/thanks");
});

//GET delete page
router.get("/delete", function (req, res) {
  const opinions = res.locals.opinions;
  opinions
    .find()
    .toArray()
    .then((results) => {
      res.render("delete", {
        title: "Delete",
        entries: results,
        siteName: opinionsDB,
      });
    })
    .catch((error) => console.error(error));
});

//POST a request to delete a post
router.post("/delete", (req, res) => {
  const opinions = res.locals.opinions;
  opinions
    // .deleteOne({ _id: ObjectID(req.body.deleteID.toString()) })
    .deleteOne({ opinion: req.body.opinion.toString() })
    .then((result) => {
      //nothing
      // if (result.ok) {
      // res.redirect("/thanks");
      // }
    })
    .catch((error) => console.log(error));
  res.redirect("/thanks");
});

//GET the read page
router.get("/read", (req, res) => {
  const opinions = res.locals.opinions;
  opinions
    .aggregate([{ $sample: { size: 50 } }])
    .toArray()
    .then((results) => {
      res.render("read", {
        title: "Read",
        entries: results,
        siteName: opinionsDB,
      });
    })
    .catch((error) => console.error(error));
});

//POST the filters to the read page

//GET the update page
router.get("/update", (req, res) => {
  res.render("update", {
    title: "Update",
    siteName: opinionsDB,
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
          opinion: req.body.opinion.toString(),
        },
      }
    )
    .then((results) => {
      res.render("update", {
        title: "Update",
        entries: results,
        siteName: opinionsDB,
      });
    })
    .catch((error) => console.error(error));
});

router.get("/thanks", (req, res) => {
  res.render("thanks", {
    title: "Thank You",
  });
});

module.exports = router;
