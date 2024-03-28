const express = require("express");

const router = express.Router();

const userInfoHandler = require("../router_handler/userInfo");

const expressJoi = require("@escook/express-joi");
const {
  update_userInfo_schema,
  update_pwd_schema,
  update_avatar_schema,
} = require("../schema/user");

const { getUserInfo, updateUserInfo, updatePwd, updateAvatar } =
  userInfoHandler;

// 获取用户信息 get
router.get("/userInfo", getUserInfo);

// 修改用户信息 post
router.post("/userInfo", expressJoi(update_userInfo_schema), updateUserInfo);

// 重置密码
router.post("/updatePwd", expressJoi(update_pwd_schema), updatePwd);

// 更新用户头像
router.post("/update/avatar", expressJoi(update_avatar_schema), updateAvatar);

module.exports = router;
