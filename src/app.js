const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const authRoutes = require('./routes/auth');
const phoneRoutes = require('./routes/phone');

const app = express();

// app.use(cors());
app.use(
  cors({
    origin: 'http://localhost:5173',
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// /auth 라우트 등록
app.use('/auth', authRoutes);
app.use('/phones', phoneRoutes);
// phone 은 프론트에서 경로 작성 할때 쓰는것
//    const res = await axios.post(
//         'http://localhost:3001/auth/login',
// 이런식 뒤는 이제 routes 파일을 작성해서 연결? 하는거
// /phones 경로로 온것을 phoneRoutes로 연결

module.exports = app;
