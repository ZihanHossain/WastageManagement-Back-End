const config = require("../database/db_config");
var sql = require("mssql");

const pool = new sql.ConnectionPool(config);
const poolConnect = pool.connect();

module.exports = {
  pool,
  poolConnect,
};
