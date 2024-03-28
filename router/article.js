const express = require("express");

const router = express.Router();

const articleHandler = require("../router_handler/article");

const expressJoi = require("@escook/express-joi");
const {
  add_cate_schema,
  id_cate_schema,
  update_cate_schema,
  article_list_schema,
  del_article_schema,
  article_detail_schema,
  add_article_schema,
  update_article_schema
} = require("../schema/article");

const {
  getArticleCates,
  addArticleCate,
  deleteArticleCate,
  getArticleCateDetail,
  updateArticleCate,
  addArticle,
  getArticleList,
  deleteArticle,
  getArticleDetail,
  updateArticle,
} = articleHandler;

// 解析form-data表单数据-模块中间件
const multer = require('multer')
const path = require('path')
const upload = multer({ dest: path.join(__dirname, '../uploads') })

// 文章类别管理
router.get("/cates", getArticleCates);

router.post("/cate/add", expressJoi(add_cate_schema), addArticleCate);

router.get("/cate/:id/delete", expressJoi(id_cate_schema), deleteArticleCate);

router.get(
  "/cate/:id/detail",
  expressJoi(id_cate_schema),
  getArticleCateDetail
);

router.post("/cate/update", expressJoi(update_cate_schema), updateArticleCate);

// 文章管理
router.post("/add", upload.single('cover_img'), expressJoi(add_article_schema), addArticle);

router.get("/list",expressJoi(article_list_schema), getArticleList);

router.get("/:id/delete", expressJoi(del_article_schema), deleteArticle);

router.get("/:id/detail",expressJoi(article_detail_schema), getArticleDetail);

router.post("/update", upload.single('cover_img'), expressJoi(update_article_schema), updateArticle);

module.exports = router;
