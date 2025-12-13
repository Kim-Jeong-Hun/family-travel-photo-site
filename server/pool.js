// pool.js 파일 = 데이터베이스 커넥션 풀을 관리하는 파일

const oracledb = require('oracledb');

const dbConfig = {
    user: "kimjeonghun",
    password: "910d11474f!",
    connectString: "localhost:1521/xepdb1"
};

async function initialize() {
    try {
        await oracledb.createPool({
            ...dbConfig,
            poolMax: 10, // 최대 연결 수 10
            poolMin: 2, // 최소 유지 연결 수 2
            poolIncrement: 1
        });
        console.log("✅ Oracle Connection Pool Created");
    } catch (err) {
        console.error("❌ Pool Initialization Error: ", err);
    }
}

async function closePool() {
    await oracledb.getPool().close();
}

module.exports = { initialize, closePool, oracledb };