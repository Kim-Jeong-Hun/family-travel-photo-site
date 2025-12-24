// pool.js 파일 = 데이터베이스 커넥션 풀을 관리하는 파일

require('dotenv').config(); // .env.local 파일에서 환경 변수 로드
const oracledb = require('oracledb');

const dbConfig = {
    user: process.env.ORACLEDB_USER,
    password: process.env.ORACLEDB_PASSWORD,
    connectString: process.env.CONNECT_STRING
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
        throw err;
    }
}

// 커넥션 풀에서 연결 하나를 가져오는 함수
async function getConnection() {
    return await oracledb.getConnection();
}

// 연결 종료 함수
async function closePool() {
    await oracledb.getPool().close();
}

module.exports = { initialize, getConnection, closePool, oracledb };