const db = require("../db/index");
const bcrypt = require("bcryptjs");

exports.getUserInfo = (req, res) => {
  const sql =
    "select id, username, nickname, email, user_pic from ev_users where id=?";
  // req 对象上的 user 属性，是 Token 解析成功，express-jwt 中间件 帮挂载上去；
  db.query(sql, req.auth.id, (err, results) => {
    // 1. 执行 SQL 执行语句
    if (err) return res.cc(err);
    // 2. 执行 SQL 语句成功， 但是查询数据条数不等于1
    if (results.length !== 1) return res.cc("获取用户信息失败");
    // 3. 将用户信息相应给客户端
    res.send({
      status: 0,
      msg: "success",
      data: results[0],
    });
  });
};

exports.updateUserInfo = (req, res) => {
  const sql = "update ev_users set ? where id=?";

  db.query(sql, [req.body, req.body.id], (err, results) => {
    if (err) return res.cc(err);
    // 执行 SQL 语句，但影响行数不等于1
    if (results.affectedRows !== 1) return res.cc("用户信息更新失败");
    res.cc("success", 0);
  });
};

exports.updatePwd = (req, res) => {
  // 验证表单数据，新旧密码不能相同
  const sql = "select * from ev_users where id=?";
  db.query(sql, req.auth.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc("该用户不存在");

    // 判断旧密码是否正确
    const compareResult = bcrypt.compareSync(
      req.body.oldPwd,
      results[0].password
    );
    if (!compareResult) return res.cc("旧密码错误，请重试！");

    // 定义更新用户密码的 SQL 语句
    const updateSql = "update ev_users set password=? where id=?";
    // 对新密码进行加密处理
    const newPwd = bcrypt.hashSync(req.body.newPwd, 10);
    // 调用db 更新数据库
    db.query(updateSql, [newPwd, req.auth.id], (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc("更新失败");
      res.cc("success", 0);
    });
  });
};

exports.updateAvatar = (req, res) => {
  const sql = "update ev_users set user_pic=? where id=?";

  db.query(sql, [req.body.avatar, req.auth.id], (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("更新失败");
    res.cc("success！", 0);
  });
};
