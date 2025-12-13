const express = require('express');
const pool = require('./pool.js');
const app = express();

// JSON 문자열 데이터를 자바스크립트 객체로 변환.
app.use(express.json()); 


// 서버 시작 시 DB 풀 초기화
// pool.initialize() : 서버가 켜질 때 DB와 미리 인사를 나눠두는 과정
pool.initialize().then(() => {
  const PORT = 6000; // 프론트가 3000번 포트 사용하므로 6000으로 변경
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
});


// getConnection() : db 풀에서 연결 받아오기
// connection.close() : db 풀에 연결 반납
// outFormat: OBJECT : 출력 포맷 객체 형태로
app.get('/users', async (req, res) => {
  let connection;
  try {
    connection = await pool.oracledb.getConnection(); // 풀에서 연결 하나 빌려오기
    const result = await connection.execute(
      `SELECT * FROM USERS`,
      [],
      { outFormat: pool.oracledb.OUT_FORMAT_OBJECT} // 출력 포맷 객체 형태로
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  } finally {
    if (connection) { // 연결됐는데 오류 발생시
      try {
        await connection.close(); // 풀에 연결 반납
      } catch (err) {
        console.error(err);
      }
    }
  }
});