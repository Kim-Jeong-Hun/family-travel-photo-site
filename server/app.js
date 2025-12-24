const express = require('express');
const app = express();

const pool = require('./oracledb_setting.js'); // 데이터베이스 풀 설정 파일
const cors = require('cors'); // 프론트 코드가 올라가있는 vercel과의 통신을 위해서 

// cors 설정 : 프론트 URL에서 데이터 요청이 가능하도록
app.use(cors({
    origin: [
        'https://family-travel-photo-site.vercel.app',
        'http://localhost:3000' // 로컬 테스트용
    ]
}));

// 프론트와의 데이터 통신용
app.use(express.json());

// 서버 시작 전 DB풀 초기화, 라우터 등록-처리
pool.initialize().then(() => {
    // 라우터 등록
    const signupRouter = require('./apis/signup.js');
    const loginRouter = require('./apis/login.js');
    // const postRouter = require('./apis/post.js'); // 임시 비활성화 (cloudinary 파일 없음)
    
    // 라우터 처리
    app.use('/apis/signup', signupRouter);
    app.use('/apis/login', loginRouter);
    // app.use('/apis/post', postRouter); // 임시 비활성화

    app.get('/', (req, res) => {
    res.json({
        message: "백엔드 서버가 정상적으로 작동중입니다.",
        status: "Healthy",
        database: "Oracle DB Connected (Thin Mode)"
    });
});

    const PORT = process.env.PORT;
    app.listen(PORT, () => {
        console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
    });
}).catch((err) => {
    console.error('데이터베이스 풀 초기화 실패:', err);
    process.exit(1);
});