const knex = require("./knex");

const CARD = "card";

module.exports = {

    /**
     * @param {number} userId - The max number of records to return.
     * @return {Promise<Array>} A promise that resolves to an array of customers.
     */
    getCardList(userId, paramObj, sort="expire_date") {
 
        // YYYY-MM-DD形式の本日の日付を取得
        const today = new Date();
        // 本日の日付をYYYY-MM-DD形式に変換
        const year = today.getFullYear();
        const month = ("0" + (today.getMonth() + 1)).slice(-2);
        const date = ("0" + today.getDate()).slice(-2);
        const todayDate = year + "-" + month + "-" + date;

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
            .where((builder)=>{
                builder.where("user_id", "=", userId);
                if(paramObj.expireFlg !== undefined){
                    console.log("expireFlg: " + paramObj.expireFlg);
                    builder = builder.andWhere("expire_flg", "=", paramObj.expireFlg)
                                .andWhere("expire_date", ">=", todayDate);
                }
                if(paramObj.word){
                    console.log("word: " + paramObj.word);
                    builder = builder.andWhere((subBuilder)=>{
                                subBuilder.orWhere("store_name", "like", "%" + paramObj.word + "%")
                                    .orWhere("benefit_name", "like", "%" + paramObj.word + "%")
                                    .orWhere("tag", "like", "%" + paramObj.word + "%");
                            });
                }
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
