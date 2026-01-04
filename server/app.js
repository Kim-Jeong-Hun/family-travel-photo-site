const express = require('express');
const app = express();
const cors = require('cors'); // 프론트 코드가 올라가있는 vercel과의 통신을 위해서 

// cors 설정 : 프론트 URL에서 데이터 요청이 가능하도록
app.use(cors({
    origin: [
        'https://family-travel-photo-site.vercel.app', // 실제 배포용
        'http://localhost:3000' // 로컬 테스트용
    ]
}));

// 프론트와의 데이터 통신용
app.use(express.json());

// 라우터 등록 & 사용
const signupRouter = require('./apis/signup.js');
const loginRouter = require('./apis/login.js');
const postRouter = require('./apis/post.js');
const myPageRouter = require('./apis/myPage.js');
app.use('/apis/signup', signupRouter);
app.use('/apis/login', loginRouter);
app.use('/apis/post', postRouter);
app.use('/apis/myPage', myPageRouter);

app.get('/', (req, res) => {
res.json({
        message: "백엔드 서버가 정상적으로 작동중입니다.",
        status: "Healthy",
        database: "Supabase (PostgreSQL) Connected"
    });
});

const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`서버가 포트 ${PORT}에서 실행 중입니다.`);
});
