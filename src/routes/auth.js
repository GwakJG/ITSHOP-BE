const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// 회원가입
router.post('/signup', authController.signup);

// 메서드가 POST 이고, url이 /auth/signup 일때 저 위에 authController.signup을 실행하겠다.

// 아이디 중복 체크
router.post('/check-id', authController.checkId);

// 로그인
router.post('/login', authController.login);

// router.post('/login/success', authController.loginSuccess);
router.post('/logout', authController.logout);
router.post('/accesstoken', authController.accessToken);
router.post('/refreshtoken', authController.refreshtoken);
router.get('/me', authController.duringLogin);

// "/signup" 다른 이유는 메서드(post)가 같아서 구분을 하기 위해 달라야 됨
// 그리고 하는일 자체가 확연히 다르기 때문에

module.exports = router;
