/*
기본 server 파일 : express, multer, path, cors 등 공부 필요
front에 사진 업로드 폼까지 만들면 이후 서버 설정
*/


// 모듈 import, 초기화
const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 4000;

// 업로드 디렉터리 준비
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// multer 설정 (로컬 저장 예시, 실서비스는 S3 같은 외부 스토리지를 권장)
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) =>
    cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, '_')}`)
});
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// 보안/편의: 프런트 도메인 허용 (개발 시 기본값)
app.use(cors({ origin: process.env.FRONT_ORIGIN || 'http://localhost:3000' }));
app.use(express.json());

// 업로드된 파일을 정적으로 서비스
app.use('/uploads', express.static(uploadDir));

// 간단한 인메모리 게시글 저장소 (프로덕션에서는 DB 사용)
const posts = [];

// POST /api/posts : 사진 + 좌표 + 제목 등 받아서 게시글 생성
// form-data: photo (file), title, lat, lng
app.post('/api/posts', upload.single('photo'), (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: 'photo required' });
    const { title, lat, lng } = req.body;
    const post = {
      id: posts.length + 1,
      title: title || '',
      lat: lat ? parseFloat(lat) : null,
      lng: lng ? parseFloat(lng) : null,
      photoUrl: `/uploads/${req.file.filename}`,
      createdAt: new Date().toISOString()
    };
    posts.push(post);
    return res.status(201).json(post);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'server error' });
  }
});

// GET /api/posts : 게시글 목록 조회
app.get('/api/posts', (req, res) => {
  res.json(posts);
});

// 기본 헬스체크
app.get('/', (req, res) => res.json({ status: 'ok', message: 'API server running' }));

// 에러 핸들러
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'server error' });
});

app.listen(PORT, () => {
  console.log(`Express API listening on http://localhost:${PORT}`);
});