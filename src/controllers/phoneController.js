const { set } = require("../app");
const db = require("../config/db");

exports.addphone = async (req, res) => {
    console.log("📌 addphone 실행됨", req.body);
    const { model, price, date, color, width, height, storage, brand } = req.body;

    try {
        await db.query('INSERT INTO phones ( model, price, brand, date, color, width, height, storage ) VALUES (?,?,?,?,?,?,?,?)', [model, price, brand, date, color, width, height, storage]);
        return res.send({ success: true, message: "등록 완료" });
    } catch (err) {
        console.log("err", err);

        return res.send({ success: false, message: "등록 서버 오류" });
    }
};
exports.modifyphone = async (req, res) => {
    const { model, price, date, color, width, height, storage, brand } = req.body;
    const { id } = req.query;

    try {
        await db.query('UPDATE phones SET model=?, price=?, brand=?, date=?, color=?, width=?, height=?, storage=? WHERE id=?', [model, price, brand, date, color, width, height, storage, id]);
        return res.send({ success: true, message: "수정 완료" });
    } catch (err) {
        console.log("err", err);
        return res.send({ success: false, message: "수정 서버 오류" });
    }
}

exports.checkphone = async (req, res) => {
    console.log("📌 checkphone 실행됨", req.query);
    const brand = req.query.brand;
    const color = req.query.color;
    const id = req.query.id;

    try {
        const [rows] = await db.query('SELECT * FROM phones WHERE brand=? OR color=? OR id=?', [brand, color, id]);
        if (rows.length === 0) {
            return res.send({ success: false, message: "데이터가 없습니다." });
        } else {
            res.send({ success: true, data: rows });//rows는 원래 배열이기때문에 [rows] 이렇게 하면 안됨
        }

    } catch (err) {
        return res.send({ success: false, message: "조회 서버 오류" });
    }
}

exports.deletephone = async (req, res) => {
    console.log('req.query', req.query)
    try {
        const [rows] = await db.query('DELETE FROM phones WHERE id=?', req.query.id);//프론트에서 보낸 id값을 받아서 삭제

        return res.send({ success: true, message: "삭제 완료", data: rows });

        // return res.send({ success: false, message: "삭제 실패" });
    } catch {

        return res.send({ success: false, message: "삭제 서버 오류" });

    }
};



