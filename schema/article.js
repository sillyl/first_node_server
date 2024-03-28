const Joi = require("joi");

// 定义 分类名称、别名 的校验规则
const name = Joi.string().required();
const alias = Joi.string().alphanum().required();

const id = Joi.number().integer().min(1).required();

exports.add_cate_schema = {
  body: {
    name,
    alias,
  },
};

exports.id_cate_schema = {
  params: {
    id,
  },
};

exports.update_cate_schema = {
  body: {
    id,
    name,
    alias,
  },
};

const cate_id_optional = Joi.number().integer().min(1).optional();
const state_optional = Joi.string().valid("草稿", "已发布").optional();
const pagenum = Joi.number().integer().min(1).required();
const pagesize = Joi.number().integer().min(1).required();
// const articleId = Joi.number().integer().min(1).required();
const title = joi.string().required()
const cate_id = joi.number().integer().min(1).required()
const content = joi.string().required().allow('')
const state = joi.string().valid('草稿', '已发布').required()

exports.article_list_schema = {
  query: {
    pagenum,
    pagesize,
    cate_id: cate_id_optional,
    state: state_optional,
  },
};

exports.del_article_schema = {
  params: {
    id,
  },
};

exports.article_detail_schema = {
  params: {
    id,
  },
};

exports.add_article_schema = {
  body: {
    title,
    cate_id,
    content,
    state,
  },
};

exports.update_article_schema = {
  body: {
    id,
    title,
    cate_id,
    content,
    state,
  },
};
