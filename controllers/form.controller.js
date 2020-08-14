const mysql = require("../config/connection");
const queries = require("../config/query");

exports.createFormId = (req, res, next) => {
  try {
    let { uId, name } = req.body;
    if (!uId || !name) {
      return res.status(400).send({ msg: "absence of mandatory fields" });
    }
    console.log(uId, name);
    mysql.query(queries.createForm, [uId, name], function (err, result) {
      if (err) throw err;
      console.log("Number of records inserted: " + result.affectedRows);
      res.status(201).send({
        msg: "created successfully",
        id: result.insertId,
      });
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "not created" });
  }
};

exports.placeQuestions = (req, res) => {
  try {
    let { formId, qType, question, qNo } = req.body;
    console.log(formId, qType, question, !qNo);
    if (!formId || !qType || !question) {
      return res.status(400).send({ msg: "absence of mandatory fields" });
    }
    mysql.query(
      queries.createQuestion,
      [formId, qType, question, qNo],
      function (err, result) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
        res.status(201).send({
          msg: "created successfully",
          id: result.insertId,
        });
      }
    );
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "not created" });
  }
};

exports.setAnswers = (req, res) => {
  try {
    let { qNo, options, formId } = req.body;
    console.log(qNo, options, formId);
    if (isNaN(qNo) || !options || !formId) {
      return res.status(400).send({ msg: "absence of mandatory fields" });
    }
    options.forEach((e, i) => {
      mysql.query(queries.createAnswer, [qNo, e, i, formId], function (
        err,
        result
      ) {
        if (err) throw err;
        console.log("Number of records inserted: " + result.affectedRows);
      });
    });
    res.status(201).send({
      msg: "created successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "not created" });
  }
};

exports.getAnswers = async (req, res) => {
  try {
    let { formId } = req.params;
    console.log(formId);
    let questions = [];
    let answers = [];
    if (!formId) {
      formId = await new Promise((resolve, reject) => {
        mysql.query(queries.selectLastFormId, function (err, result) {
          if (err || !result.length) return reject(err);
          console.log("result is ", result[0].form_id);
          resolve(result[0].form_id);
        });
      });
    }
    console.log("formid is ", typeof formId);
    if (!formId || formId == null)
      return res.status(404).send({ msg: "Not found" });

    questions = await new Promise((resolve, reject) => {
      mysql.query(queries.selectQuestionNo, [formId], function (err, result) {
        if (err) reject(err);
        // let arr = [];
        resolve(
          result.map((e) => {
            return { qType: e.q_type, question: e.question, qNo: e.s_no };
          })
        );
      });
    });
    console.log(questions);
    // questions.forEach((e, i) => {
    answers = await new Promise((resolve, reject) => {
      mysql.query(queries.getAnswerBasedOnFormId, [formId], function (
        err,
        result
      ) {
        if (err) reject(err);
        console.log(result);
        let tmp = [];
        result.forEach((ele, j) => {
          if (!tmp.length || tmp[tmp.length - 1].qNo != ele.q_no)
            tmp.push({ qNo: ele.q_no, options: [ele.answer], formId });
          else tmp[tmp.length - 1].options.push(ele.answer);
        });
        resolve(tmp);
      });
    });

    res.status(200).send({
      questions,
      answers,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send({ msg: "not created" });
  }
};
