const express = require('express');
const cors = require('cors'); // 프론트 코드가 올라가있는 vercel과의 통신을 위해서 
const app = express();
const pool = require('./pool.js');
const PORT = 6000;

app.use(express.json());


// cors 설정 : 프론트에서 데이터 요청이 가능하도록
app.use(cors({
    origin: 'https://family-travel-photo-site.vercel.app/'
}));

app.get('/', (req, res) => {
    res.json({
        message: "백엔드 서버가 정상적으로 작동 중입니다!",
        status: "Healthy",
        database: "Oracle DB Connected (Thin Mode)"
    });
});

app.listen(PORT, () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});