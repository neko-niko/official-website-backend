const BaseClass = require("./base_class");
const { configs } = require("../config");
const db_config = configs["db_config"];
const fs = require("fs");
const path = require("path");
const mysql = require("../utils/mysql_util");
class BaseDao extends BaseClass {
    constructor() {
        super(...arguments);
        this.table_prefix = configs["app_config"]["server_base"].table_prefix;
    }
    /**
     * MySql建表方法
     */
    async createTable() {
        try {
            if (db_config.db_type === "mysql") {
                let drop = `DROP TABLE IF EXISTS ${this.table}`;
                await mysql.query(drop, [], this.instance);
                let filepath = path.join(__dirname, "../dao/mysql/sql", this.table + ".sql");
                let sql = fs.readFileSync(filepath).toString();
                sql = sql.replace("{table}", this.table);
                let args = [];
                let rows = await mysql.query(sql, args, this.instance);
                this.logger.debug(`database exec success|sql=${sql}|args=${JSON.stringify(args)}|ret=${JSON.stringify(rows)}`);
                return rows;
            }
        } catch (err) {
            this.logger.error(`createTable Error|tableName=${this.table}|err=${err.message}`);
        }
    }
}

module.exports = BaseDao;