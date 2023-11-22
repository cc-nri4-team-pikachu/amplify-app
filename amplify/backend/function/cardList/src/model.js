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
            card_id: "card.card_id",
            store_name: "card.store_name",
            benefit_name: "card.benefit_name",
            benefit_count: "card.benefit_count",
            expire_date: "card.expire_date",
            image: "card.image",
            tag: "card.tag",
            })
            .where({
            "expire_flg": 0,
            "user_id": userId,
            })
            .orderBy(sort, "asc")
            .catch(function (err) {
                console.error(err);
            });
    },

    getValidCardList(userId) {
        // YYYY-MM-DD形式の本日の日付を取得
        const today = new Date();
        // 本日の日付をYYYY-MM-DD形式に変換
        const year = today.getFullYear();
        const month = ("0" + (today.getMonth() + 1)).slice(-2);
        const date = ("0" + today.getDate()).slice(-2);
        const todayDate = year + "-" + month + "-" + date;

        return knex
            .select({
            cardId: "card.card_id",
            store_name: "card.store_name",
            benefit_name: "card.benefit_name",
            benefit_count: "card.benefit_count",
            expire_date: "card.expire_date",
            image: "card.image",
            tag: "card.tag",
            })
            .from(CARD)
            .where({
            "expire_flg": 0,
            "user_id": userId,
            "expire_date": ">=" + todayDate,
            })
            .orderBy(sort, "asc")
            .catch((err) => {
            throw Error(err);
            });
        },

    updateCard(cardId, userId, updateData){
        return knex(CARD)
            .where({
            "card_id": cardId,
            "user_id": userId,
            })
            .update({
            "benefitCount": updateData.benefitCount,
            })
            .catch((err) => {
            throw Error(err);
            }); 
    },

    deleteCard(cardId, userId){
        return knex(CARD)
            .where({
            "card_id": cardId,
            "user_id": userId,
            })
            .update({
            "expire_flg": 1,
            })
            .catch((err) => {
            throw Error(err);
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
            "tag": addData.tag,
        })
        .then((result)=>{
            return result[0].card_id;
        })
        .catch((err) => {
            throw Error(err);
        }); 
    },



};
