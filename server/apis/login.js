const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt'); // 비밀번호 해싱 라이브러리
const pool = require('../pool.js'); // 데이터베이스 커넥션 풀

router.post('/', async (req, res) => {
    const {id, password} = req.body;
    let connection;


    try {
        // 아이디, 비밀번호 검증
        if (!id || !password) {
        return res.status(400).json({ 
                success: false, 
                message: '필수 항목을 입력해주세요.' 
            });
        }

        // 풀에서 데이터베이스 연결 가져오기
        connection = await pool.oracledb.getConnection();

        // SQL문 실행하여 가져온 ID를 result에 저장
        const result = await connection.execute(
            `SELECT PASSWORD FROM USERS WHERE USER_ID = :id`, {id: id},
            { outFormat: pool.oracledb.OUT_FORMAT_OBJECT });
            
        // ID 길이가 0인 경우
        if (result.rows.length === 0) {
            return res.status(401).json({ 
                success: false,
                message: "아이디가 존재하지 않습니다."
            });
        }

        // 입력한 비밀번호와 저장된 비밀번호 비교
        const match = await bcrypt.compare(password, result.rows[0].PASSWORD);

        // 비밀번호 일치 시
        if(match) {
            res.json({
                success: true,
                message: "로그인에 성공하셨습니다."
            });
        } else {
            res.status(401).json({
                success: false,
                message: "비밀번호가 일치하지 않습니다."
            });
        }   
    } catch (err) {
        console.error('로그인 오류:', err);
        res.status(500).json({ 
            success: false,
            message: "로그인에 실패하셨습니다." 
        });
    } finally {
        if(connection) {
            try {
                await connection.close();
            } catch (err) {
                console.error(err);
            }
        }
    }
});

module.exports = router;