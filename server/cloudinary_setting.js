const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

// 1. Cloudinary 로그인 설정
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// 2. Multer용 스토리지 엔진 (사진 저장 규칙) 설정
const storage = new CloudinaryStorage({
  cloudinary: cloudinary, // 설정한 config로 로그인
  params: {
    folder: 'map_posts', // Cloudinary 내에서 저장될 폴더 이름
    allowed_formats: ['jpg', 'png', 'jpeg'], // 허용할 확장자 (사진용 확장자만)
  },
});

const upload = multer({ storage: storage });

module.exports = {cloudinary, upload};