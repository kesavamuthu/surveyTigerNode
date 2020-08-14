module.exports = {
  createForm: "Insert into form_details( u_id, name ) values (?, ?) ",
  selectLastFormId:
    "select * from form_details  where form_id in (select form_id from questions) order by form_id desc limit 1",
  createQuestion:
    "Insert into questions (form_id, q_type, question, s_no) values (?, ?, ?, ?)",
  createAnswer:
    "Insert into option_details (q_no, answer, opt_no, form_id) value (?, ?, ?, ?)",
  getAnswerBasedOnFormId:
    "select answer, q_no from option_details where form_id=?",
  selectQuestionNo:
    "select q_type, question, s_no from questions where form_id=?",
};
