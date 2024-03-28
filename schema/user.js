// 导入验证规则的包

const Joi = require("joi");

const username = Joi.string().alphanum().min(3).max(12).required();
const password = Joi.string()
  .pattern(new RegExp("^[a-zA-Z0-9]{6,12}$"))
  .required();

const id = Joi.number().integer().min(1).required();
const nickname = Joi.string().required();
const email = Joi.string().required();

const avatar = Joi.string().dataUri().required();

// 定义验证注册和登录表单数据的规则对象
exports.reg_login_schema = {
  body: {
    username,
    password,
  },
};

exports.update_userInfo_schema = {
  body: {
    id,
    nickname,
    email,
  },
};

exports.update_pwd_schema = {
  body: {
    oldPwd: password,
    // Joi.ref("oldPwd") 表示 newPwd 的值 必须和 oldPwd 一致
    // Joi.not(Joi.ref("oldPwd")) 表示 newPwd 的值不能等于 oldPwd
    // concat() 用于合并 Joi.not(Joi.ref("oldPwd")) 和 password 两条验证规则
    newPwd: Joi.not(Joi.ref("oldPwd")).concat(password),
  },
};

exports.update_avatar_schema = {
  body: {
    avatar,
  },
};
