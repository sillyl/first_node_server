const express = require("express");
const cors = require("cors");
const joi = require("joi");

const userRouter = require("./router/user");
const userInfoRouter = require("./router/userInfo");
const articleRouter = require("./router/article");

const app = express();

app.use((req, res, next) => {
  res.cc = (err, status = 1) => {
    res.send({
      status, // status: 1 失败， 0 成功
      msg: err instanceof Error ? err.message : err,
    });
  };
  next();
});

// 一定要在路由之前配置解析 Token 的中间件
const { expressjwt: jwt } = require("express-jwt");
const config = require("./config");

// /dev-api不需要token验证
app.use(
  jwt({ secret: config.jwtSecretKey, algorithms: ["HS256"] }).unless({
    path: [/^\/dev-api/],
  })
);

// 配置 cors中间件（支持跨域）
app.use(cors());

// 配置解析表单数据(application/x-www-form-urlencoded)的中间件
app.use(express.urlencoded({ extended: false }));

// 使用userRouter路由模块
app.use("/dev-api", userRouter);
app.use("/api", userInfoRouter);
app.use("/api/article", articleRouter);

// 定义错误级别的中间件
app.use((err, req, res, next) => {
  // 验证失败导致的错误
  if (err instanceof joi.ValidationError) return res.cc(err);
  if (err.name === "UnauthorizedError") return res.cc("身份认证失败！", 401);
  // 未知错误
  res.cc(err);
});

app.listen(3003, () => {
  console.log("api server running: http://127.0.0.1:3003");
});
