const mysql = require("mysql");

// 创建数据库连接对象
const db = mysql.createPool({
  host: "127.0.0.1",
  user: "root",
  password: "123456",
  database: "my_db_01",
});

module.exports = db;

// module.exports = {
//   queryByPromisify: function (sql, data) {
//     return new Promise((resolve, reject) => {
//       db.query(sql, data, (err, results) => {
//         if (err) reject(err);
//         else {
//           resolve(results); // 如果没有错误，就resolve这个Promise，返回结果
//         }
//       });
//     });
//   },
// };
