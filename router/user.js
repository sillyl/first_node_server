const express = require("express");

// 创建路由对象
const router = express.Router();

// 导入路由处理函数
const userHandler = require("../router_handler/user");

// 1. 导入验证数据的中间件
const expressJoi = require("@escook/express-joi");
// 2. 导入需要的验证规则对象
const { reg_login_schema } = require("../schema/user");

const { reguser, login } = userHandler;

// 注册新用户
router.post("/reguser", expressJoi(reg_login_schema), reguser);

// 登录
router.post("/login", expressJoi(reg_login_schema), login);

// 将路由对象共享出去
module.exports = router;
