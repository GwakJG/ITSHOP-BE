const express = require("express");
const router = express.Router();
const phoneController = require("../controllers/phoneController");

router.get("", phoneController.checkphone);//조회  REST API 규칙 공부
router.post("", phoneController.addphone);// 등록
router.put("", phoneController.modifyphone);// 수정 , PATCH 메서드도 있음. 차이점에 대해 공부해보기
router.delete("", phoneController.deletephone);// 삭제
// router.delete("phone", phoneController.deletephone); -> 이렇게 하면 안됨 http://localhost:3001/phones/phone 이게됨 어떤의미인지 확인 힒듬 
// /phones 라우트로 이미 지정이 되어있기 때문에

module.exports = router;