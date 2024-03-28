const { log } = require("console");
const db = require("../db/index");
const path = require("path");

exports.getArticleCates = (req, res) => {
  // 查询未被删除的文章列表，并升序排列
  const sql = "select * from ev_article_cate where is_delete=0 order by id asc";
  db.query(sql, (err, results) => {
    if (err) return res.cc(err);
    res.send({
      status: 0,
      msg: "success",
      data: results,
    });
  });
};

exports.addArticleCate = (req, res) => {
  const body = req.body;
  const { name, alias } = body;

  const sql = "select * from ev_article_cate where name=? or alias=?";

  db.query(sql, [name, alias], (err, results) => {
    if (err) return res.cc(err);
    // 判断数据是否被占用
    if (results.length === 2) return res.cc("name和alias被占用，请修改重试！");
    // length为1的情况
    if (results.length === 1) {
      if (results[0].name === name && results[0].alias === alias)
        return res.cc("name和alias被占用，请修改重试！");
      if (results[0].name === name) return res.cc("name被占用，请修改重试！");
      if (results[0].alias === alias)
        return res.cc("alias被占用，请修改重试！");
    }

    // name和alias 都可用，在数据库添加
    const sqlAdd = "insert into ev_article_cate set ?";
    db.query(sqlAdd, body, (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc("新增文章分类失败");
      res.cc("success", 0);
    });
  });
};

exports.deleteArticleCate = (req, res) => {
  // const sql = "delete from ev_article_cate where id=?"
  // 这里的删除不是真正意义的将数据库删除，而是将is_delete标识修改为1

  const sql = "update ev_article_cate set is_delete=1 where id=?";
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.affectedRows !== 1) return res.cc("删除文章分类失败！");
    res.cc("success", 0);
  });
};

exports.getArticleCateDetail = (req, res) => {
  const sql = "select * from ev_article_cate where id=?";
  db.query(sql, req.params.id, (err, results) => {
    if (err) return res.cc(err);
    if (results.length !== 1) return res.cc("获取文章分类失败！");
    res.send({
      status: 0,
      msg: "success",
      data: results[0],
    });
  });
};

exports.updateArticleCate = (req, res) => {
  // 更新不能简单更新，需要判断更新的数据是否被占用（类似于添加）
  // 将当前 id 排除，将剩余数据对name和alias做校验
  const sql =
    "select * from ev_article_cate where id<>? and (name=? or alias=?)";
  const { id, name, alias } = req.body;
  db.query(sql, [id, name, alias], (err, results) => {
    if (err) return res.cc(err);
    // 判断数据是否被占用
    if (results.length === 2) return res.cc("name和alias被占用，请修改重试！");
    // length为1的情况
    if (results.length === 1) {
      if (results[0].name === name && results[0].alias === alias)
        return res.cc("name和alias被占用，请修改重试！");
      if (results[0].name === name) return res.cc("name被占用，请修改重试！");
      if (results[0].alias === alias)
        return res.cc("alias被占用，请修改重试！");
    }

    // 执行更新操作
    const sql = "update ev_article_cate set ? where id=?";
    db.query(sql, [req.body, id], (err, results) => {
      if (err) return res.cc(err);
      if (results.affectedRows !== 1) return res.cc("更新失败");
      res.cc("success", 0);
    });
  });
};

// 文章管理
exports.addArticle = async (req, res) => {
  if (!req.file || req.file.fieldname !== "cover_img") {
    return res.cc("文章封面不能为空！");
  }
  const articleInfo = {
    ...req.body,
    pub_date: new Date(),
    author_id: req.auth.id,
    cover_img: path.join("/uploads", req.file.filename),
  };

  const sql = "insert into ev_articles set ?";
  db.query(sql, articleInfo, (err, results) => {
    if (err) reject(err);
    if (results.affectedRows !== 1) {
      return res.cc("发布文章失败");
    }
    res.cc("success", 0);
  });
};

// 获取文章列表
exports.getArticleList = async (req, res) => {
  const sql = `select a.id, a.title, a.pub_date, a.state, b.name as cate_name from ev_articles as a,ev_article_cate as b where a.cate_id = b.id and a.cate_id = ifnull(?, a.cate_id)  and a.state = ifnull(?, a.state) and a.is_delete = 0  limit ?,?`;
  const { pagenum, pagesize, cate_id } = req.query;
  db.query(
    sql,
    [
      cate_id || null,
      req.query.state || null,
      (pagenum - 1) * pagesize,
      pagesize,
    ],
    (err, results) => {
      if (err) return res.cc(err);
      const countSql =
        "select count(*) as num from ev_articles where is_delete = 0 and state = ifnull(?,state) and cate_id = ifnull(?,cate_id)";

      db.query(
        countSql,
        [req.query?.state || null, cate_id || null],
        (errs, results1) => {
          if (errs) return res.cc(errs);
          const [{ num }] = results1;
          if (results?.length > 0) {
            res.send({
              status: 0,
              msg: "success",
              data: results,
              total: num,
            });
          }
        }
      );
    }
  );
};

exports.deleteArticle = (req, res) => {
  const sql = "update ev_articles set is_delete = 1 where id = ?";
  db.query(sql, [req.params.id], (err, result) => {
    if (result.affectedRows !== 1) {
      return res.cc(err);
    }
    res.cc("success", 0);
  });
};

// 获取单个文章详情
exports.getArticleDetail = (req, res) => {
  const sql = "select * from ev_articles where id = ?";
  db.query(sql, req.params.id, (err, result) => {
    if (err) return res.cc(err);
    if (result.length !== 1) return res.cc("获取文章详情失败！");
    res.send({
      status: 0,
      msg: "success",
      data: result[0],
    });
  });
};

exports.updateArticle = (req, res) => {
  if (!req.file || reqfile.fieldname !== "cover_img") {
    return res.cc("文章封面必选");
  }
  const sql = "update ev_articles set ? where id = ?";

  const articleInfo = {
    ...req.body,
    pub_date: new Date(),
    cover_img: path.join("/updates", req.file.filename),
  };
  db.query(sql, [articleInfo, req.body.id], (err, result)=>{
    if (err) return res.cc(err);
    if (result.affectedRows !== 1) return res.cc("更新文章失败");
    res.cc("success", 0);
  });
};
