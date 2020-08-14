let express = require("express");
let router = express.Router();
const form = require("../controllers/form.controller");
router.get("/", (req, res, next) => {
  res.status(200).send({ msg: "O.K." });
});

router.post("/create", form.createFormId);
router.post("/set", form.placeQuestions);
router.post("/setans", form.setAnswers);
router.get("/get", form.getAnswers);
module.exports = router;
