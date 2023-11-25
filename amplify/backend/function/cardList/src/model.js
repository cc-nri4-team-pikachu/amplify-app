const knex = require("./knex");

const CARD = "card";

module.exports = {

    /**
     * @param {number} userId - The max number of records to return.
     * @return {Promise<Array>} A promise that resolves to an array of customers.
     */
    getCardList(userId, sort="expire_date") {
        return knex(CARD)
            .select({
                cardId: "card.card_id",
                storeName: "card.store_name",
                benefitName: "card.benefit_name",
                benefitCount: "card.benefit_count",
                expireDate: "card.expire_date",
                expireFlg: "card.expire_flg",
                image: "card.image",
                tag: "card.tag",
            })
            .where({
                "user_id": userId,
            })
            .orderBy(sort, "asc")
            .catch(function (err) {
                console.error(err);
            });
    },

    getValidCardList(userId, sort="expire_date", expireFlg=999) {
        // YYYY-MM-DD形式の本日の日付を取得
        const today = new Date();
        // 本日の日付をYYYY-MM-DD形式に変換
        const year = today.getFullYear();
        const month = ("0" + (today.getMonth() + 1)).slice(-2);
        const date = ("0" + today.getDate()).slice(-2);
        const todayDate = year + "-" + month + "-" + date;

        const whereObj = {};
        whereObj["user_id"] = userId;
        whereObj["expire_date"] = ">=" + todayDate;
        // expireFlgがデフォルト値の999の場合は、expire_flgの条件を追加しない
        if(expireFlg !== 999){
            whereObj["expire_flg"] = expireFlg;
        }

        return knex
            .select({
                cardId: "card.card_id",
                storeName: "card.store_name",
                benefitName: "card.benefit_name",
                benefitCount: "card.benefit_count",
                expireDate: "card.expire_date",
                image: "card.image",
                tag: "card.tag",
            })
            .from(CARD)
            .where({
                "user_id": userId,
                "expire_date": ">=" + todayDate,
                "expire_flg": expireFlg,
            })
            .orderBy(sort, "asc")
            .catch(function (err) {
                console.error(err);
            });
        },

    updateCard(userId,cardId,  updateData){
        console.log("cardId: " + cardId);
        console.log("userId: " + userId);
        console.log("updateData: " + JSON.stringify(updateData));
        // knexで、オブジェクトに存在する要素のみ更新したい
        // そのために、オブジェクトの要素を一つずつ取り出す
        // その要素が存在するかどうかを確認し、存在する場合のみ更新する
        let updateObj = {};
        if(updateData.storeName){
            updateObj.store_name = updateData.storeName;
        }
        if(updateData.benefitName){
            updateObj.benefit_name = updateData.benefitName;
        }
        if(updateData.benefitCount){
            updateObj.benefit_count = updateData.benefitCount;
        }
        if(updateData.expireDate){
            updateObj.expire_date = updateData.expireDate;
        }
        if(updateData.image){
            updateObj.image = updateData.image;
        }
        if(updateData.tag){
            updateObj.tag = updateData.tag;
        }
        // 対象が存在しない場合は、0を返す
        // 存在する場合は、ボディの内容で更新する。
        return knex(CARD)
            .where({
                "card_id": cardId,
                "user_id": userId,
            })
            .update(updateObj)
            .then((result) => {
                if (result === 0) {
                    return 0;
                }
                return result;
            })
            .catch((err) => {
                console.error(err);
                throw Error(err);
            }); 
    },

    deleteCard(userId, cardId){
        // 対象が存在しない場合は、0を返す
        // 存在する場合は、expire_flgを1にする
        return knex(CARD)
            .where({
                "card_id": cardId,
                "user_id": userId,
            })
            .update({
            "expire_flg": 1,
            })
            .then((result) => {
                if (result === 0) {
                    return 0;
                }
                return result;
            })
            .catch((err) => {
                console.error(err);
            }); 
    },

    addCard(userId, addData){
        return knex(CARD)
        .insert({
            "user_id": userId,
            "store_name": addData.storeName,
            "benefit_name": addData.benefitName,
            "benefit_count": addData.benefitCount,
            "expire_date": addData.expireDate,
            "image": addData.image,
            "expire_flg": 0,
            "tag": addData.tag,
        })
        .returning("card_id")
        .then((result)=>{
            return result[0].card_id;
        })
        .catch(function (err) {
            console.error(err);
        });
    },

};
