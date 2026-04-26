const oracledb = require("oracledb");

async function execute(sql, binds = {}) {
    let connection;

    try {
        connection = await oracledb.getConnection({
            user: "app_user",
            password: "123",
            connectString: "localhost:1521/orcl.localdomain"
        });

        const result = await connection.execute(sql, binds, {
            outFormat: oracledb.OUT_FORMAT_OBJECT
        });

        return result;

    } finally {
        if (connection) {
            await connection.close();
        }
    }
}

module.exports = { execute };