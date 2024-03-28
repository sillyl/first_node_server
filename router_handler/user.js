// 导入数据库
const db = require("../db/index");

// 导入 bcrypt 进行加密
const bcrypt = require("bcryptjs");

// 生成 Token 包
const jwt = require("jsonwebtoken");

// 导入配置文件
const config = require("../config");

// 抽离router文件下 user.js 中的路由处理函数

exports.reguser = (req, res) => {
  // 获取客户端提交到服务器的表单数据
  const userInfo = req.body;
  // 对表单数据做校验
  // if (!userInfo.username || !userInfo.password) {
  //   return res.send({
  //     msg: "用户名或密码不能为空！",
  //   });
  // }

  // 定义 SQL 语句， 查询用户是否被占用
  const sqlStr = "select * from ev_users where username=?";

  db.query(sqlStr, [userInfo.username], (err, result) => {
    if (err) {
      // return res.send({
      //   status: 1,
      //   msg: err.message,
      // });
      return res.cc(err);
    }

    // 判断用户名是都被占用
    if (result.length > 0) {
      // return res.send({
      //   status: 0,
      //   msg: "用户名已被使用，请更新！",
      // });
      res.cc("用户名已被使用，请更新！");
    }
  });
  userInfo.password = bcrypt.hashSync(userInfo.password, 10);

  const sqlSt1 = "insert into ev_users set ?";
  db.query(
    sqlSt1,
    { username: userInfo.username, password: userInfo.password },
    (err, result) => {
      // 判断sql 语句是否成功
      // if (err) return res.send({ status: 1, msg: err.message });
      if (err) return res.cc(err);
      // 判断影响行数是否为1，数据表中受影响的行数，数据插入成功则为1，失败则为0；在主键自增的情况下，insertId是数据插入成功后对应的主键id，如果主键不自增，则insertId为0。
      if (result.affectedRows !== 1)
        // return res.send({ status: 1, msg: "注册用户失败，稍后重试！" });
        return res.cc("注册用户失败，稍后重试！");

      // 注册用户
      // res.send({ status: 0, msg: "注册成功！" });
      res.cc("success", 0);
    }
  );
  // console.log("userInfo", userInfo);
  // res.send("reguser ok!");
};

exports.login = (req, res) => {
  // 接收表单数据
  const userInfo = req.body;
  // 定义SQL语句
  const sql = "select * from ev_users where username=?";
  // 执行 SQL 语句， 根据用户名查询用户的信息
  db.query(sql, userInfo.username, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc("登陆失败！");
    // TODO 判断密码是否正确
    const compareResult = bcrypt.compareSync(
      userInfo.password,
      results[0].password
    );
    if (!compareResult) return res.cc("登陆失败，请查看密码是否正确！");

    // 在服务器端生成 JWT的 Token 的字符串
    // 注： 在生成Token字符串的时候，要剔除密码和头像的值
    const user = { ...results[0], password: "", user_pic: "" };
    // 对用户的信息进行加密，生成 Token 字符串
    const { jwtSecretKey, expiresIn } = config;
    const tokenStr = jwt.sign(user, jwtSecretKey, { expiresIn });
    const cookieOptions = {
      maxAge: 24 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false,
      sameSite: "strict",
    };
    // 将cookie 写入浏览器
    res.cookie("lg_key_", "Bearer " + tokenStr);
    res.send({
      status: 0,
      msg: "success",
      token: "Bearer " + tokenStr,
    });
  });
};
