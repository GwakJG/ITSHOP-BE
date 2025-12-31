const db = require('../config/db');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  const { id, pw } = req.body;

  try {
    await db.query('INSERT INTO users (userId, password) VALUES (?,?)', [
      id,
      pw,
    ]);
    res.send({ success: true, message: '회원가입 완료!' });
  } catch (err) {
    console.log(err);
    res.send({ success: false, message: '서버 오류' });
  }
};

exports.checkId = async (req, res) => {
  const { id } = req.body;

  try {
    const [rows] = await db.query('SELECT * FROM users WHERE userId=?', [id]);
    if (rows.length > 0) {
      return res.send({
        success: false,
        message: '이미 존재하는 아이디입니다.',
      });
    }

    return res.send({ success: true, message: '사용 가능한 아이디입니다.' });
  } catch (err) {
    return res.send({ success: false, message: '서버 오류' });
  }
};

exports.duringLogin = async (req, res) => {
  console.log('req.cookies', req.cookies);
  const token = req.cookies.accessToken;

  if (!token) {
    return res.status(401).json({ success: false });
  }

  try {
    // 1. 먼저 JWT 검증
    const payload = jwt.verify(token, process.env.ACCESS_SECRET);

    // 2. payload의 userId로 DB 조회
    const [rows] = await db.query('SELECT * FROM users WHERE userId=?', [
      payload.userId,
    ]);

    if (rows.length === 0) {
      return res.status(401).json({ success: false });
    }

    const user = rows[0];
    const isAdmin = user.role === 'ADMIN';

    res.json({
      success: true,
      admin: isAdmin,
      user: {
        id: user.id,
        role: user.role,
        // 필요한 다른 정보
      },
    });
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ success: false });
  }
};

exports.login = async (req, res) => {
  const { id, pw } = req.body;

  try {
    const [rows] = await db.query(
      'SELECT * FROM users WHERE userId=? AND password=?',
      [id, pw]
    );

    if (rows.length > 0) {
      const accessToken = jwt.sign({ userId: id }, process.env.ACCESS_SECRET, {
        expiresIn: '5m',
        issuer: 'About Tech',
      });

      const refreshToken = jwt.sign(
        { userId: id },
        process.env.REFRESH_SECRET,
        {
          expiresIn: '24h',
          issuer: 'About Tech',
        }
      );

      // token 전송
      res.cookie('accessToken', accessToken, {
        secure: false, //http 환경에서만 true 로컬은 http 없어서 flase 배포는 무조건 true
        httpOnly: true, //서버에서만 접근 = 가능 보안 강화
      });

      res.cookie('refreshToken', refreshToken, {
        secure: false,
        httpOnly: true,
      });

      res.send({ success: true, message: rows[0] });
    } else {
      return res.send({ success: false });
    }
  } catch (err) {
    console.error('LOGIN ERROR ====>', err);
    return res.send({ success: false, message: '서버 오류' });
  }
};

exports.logout = async (req, res) => {
  try {
    res.clearCookie('accessToken', (httpOnly = true), (secure = false));
    res.clearCookie('refreshToken', (httpOnly = true), (secure = false));
    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false });
  }
};

exports.accessToken = async (req, res) => {
  try {
    const token = req.cookies.accessToken;
    if (!token) {
      return res.status(404).json({ message: 'User not found' });
    }
    const data = jwt.verify(token, process.env.ACCESS_SECRET);
    const [rows] = await db.query('SELECT * FROM users WHERE userId = ?', [
      data.userId,
    ]);
    const userData = rows[0];

    const { pw, ...others } = userData;
    return res.status(200).json(others);
  } catch (err) {
    return res.status(500).json(err);
  }
};
exports.refreshtoken = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    const data = jwt.verify(token, process.env.REFRESH_SECRET);
    const [rows] = await db.query('SELECT * FROM users WHERE userId = ?', [
      data.userId,
    ]);
    const userData = rows[0];
    const accessToken = jwt.sign(
      {
        userId: userData.userId,
      },
      process.env.ACCESS_SECRET,
      {
        expiresIn: '5m',
        issuer: 'About Tech',
      }
    );
    res.cookie('accessToken', accessToken, {
      secure: false,
      httpOnly: true,
    });
    return res.status(200).json({ success: true });
  } catch (err) {
    res.status(500).json(err);
  }
};
// exports.loginSuccess = (req, res) => { };
