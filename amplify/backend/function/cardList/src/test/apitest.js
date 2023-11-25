// テストの準備
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const app = require("../app");
chai.should();

// サーバー起動


// テストコード処理部分
describe("Reading API Server", () => {
  // テストの都度リクエスト作成
  let request;
  beforeEach(() => {
    request = chai.request(app);
  });

  // ベースシナリオ
  describe("basics", () => {
    // 【GET】カード一覧取得API
    describe("GET /users/:user_id/cards - get all Card", () => {
      // 正常系
      it("should return all card", async () => {
        // 準備
        const compareData1 = { cardId: 1, storeName: "テスト店名",  benefitName: "テスト特典名",  benefitCount: 10, expireDate: "2000/01/01", expireFlg: 0, image: "テストイメージ", tag: "テストタグ" };
        const compareData2 = { cardId: 2, storeName: "テスト店名2", benefitName: "テスト特典名2", benefitCount: 11, expireDate: "2100/02/01", expireFlg: 0, image: "テストイメージ2", tag: "テストタグ2" };
        const compareData3 = { cardId: 3, storeName: "テスト店名3", benefitName: "テスト特典名3", benefitCount: 12, expireDate: "2100/03/01", expireFlg: 0, image: "テストイメージ3", tag: "テストタグ3" };
        const compareData4 = { cardId: 4, storeName: "テスト店名4", benefitName: "テスト特典名4", benefitCount: 13, expireDate: "2100/06/01", expireFlg: 0, image: "テストイメージ4", tag: "テストタグ4" };
        const compareData5 = { cardId: 5, storeName: "テスト店名5", benefitName: "テスト特典名5", benefitCount: 14, expireDate: "2100/05/01", expireFlg: 0, image: "テストイメージ5", tag: "テストタグ5" };
        const compareData6 = { cardId: 6, storeName: "テスト店名6", benefitName: "テスト特典名6", benefitCount: 14, expireDate: "2100/06/01", expireFlg: 1, image: "テストイメージ5", tag: "テストタグ6" };
        const compareData7 = { cardId: 7, storeName: "テスト店名7", benefitName: "テスト特典名7", benefitCount: 1,  expireDate: "2100/08/01", expireFlg: 0, image: "テストイメージ7", tag: "テストタグ7" };

        // 実行
        const res = await request.get("/users/1/cards");
        const resData = JSON.parse(res.text);
        console.log("GETDATA:"+resData);
        // 検証
        res.should.be.json;
        resData.length.should.equal(7);
        resData[0].should.deep.equal(compareData1);
        resData[1].should.deep.equal(compareData2);
        resData[2].should.deep.equal(compareData3);
        // テストデータとして、４より５が先に来るようにしている
        resData[3].should.deep.equal(compareData5);
        resData[4].should.deep.equal(compareData4);
        resData[5].should.deep.equal(compareData6);
        resData[6].should.deep.equal(compareData7);
      });

      // 正常系 - 有効データのみ取得
      it("should return all valid card", async () => {
        // 準備
        const compareData2 = { cardId: 2, storeName: "テスト店名2", benefitName: "テスト特典名2", benefitCount: 11, expireDate: "2100/02/01", expireFlg: 0, image: "テストイメージ2", tag: "テストタグ2" };
        const compareData3 = { cardId: 3, storeName: "テスト店名3", benefitName: "テスト特典名3", benefitCount: 12, expireDate: "2100/03/01", expireFlg: 0, image: "テストイメージ3", tag: "テストタグ3" };
        const compareData4 = { cardId: 4, storeName: "テスト店名4", benefitName: "テスト特典名4", benefitCount: 13, expireDate: "2100/06/01", expireFlg: 0, image: "テストイメージ4", tag: "テストタグ4" };
        const compareData5 = { cardId: 5, storeName: "テスト店名5", benefitName: "テスト特典名5", benefitCount: 14, expireDate: "2100/05/01", expireFlg: 0, image: "テストイメージ5", tag: "テストタグ5" };
        const compareData7 = { cardId: 7, storeName: "テスト店名7", benefitName: "テスト特典名7", benefitCount: 1,  expireDate: "2100/08/01", expireFlg: 0, image: "テストイメージ7", tag: "テストタグ7" };

        // 実行
        const res = await request.get("/users/1/cards?valid=true");
        const resData = JSON.parse(res.text);
        // 検証
        resData.length.should.equal(5);
        resData[0].should.deep.equal(compareData2);
        resData[1].should.deep.equal(compareData3);
        resData[2].should.deep.equal(compareData5);
        // テストデータとして、４より５が先に来るようにしている
        resData[3].should.deep.equal(compareData4);
        resData[4].should.deep.equal(compareData7);
      });

      // 正常系 - キーワード指定
      it("should return search card", async () => {
        // 準備
        const compareData7 = { cardId: 7, storeName: "テスト店名7", benefitName: "テスト特典名7", benefitCount: 1,  expireDate: "2100/08/01", expireFlg: 0, image: "テストイメージ7", tag: "テストタグ7" };

        // 実行
        const res1 = await request.get(encodeURI("/users/1/cards?word=店名7"));
        request = chai.request(app);
        const res2 = await request.get(encodeURI("/users/1/cards?word=特典名7"));
        request = chai.request(app);
        const res3 = await request.get(encodeURI("/users/1/cards?word=タグ7"));

        const resData1 = JSON.parse(res1.text);
        const resData2 = JSON.parse(res2.text);
        const resData3 = JSON.parse(res3.text);
        // 検証
        resData1.length.should.equal(1);
        resData2.length.should.equal(1);
        resData3.length.should.equal(1);
        resData1[0].should.deep.equal(compareData7);
        resData2[0].should.deep.equal(compareData7);
        resData3[0].should.deep.equal(compareData7);
      });

          // 正常系 - キーワード指定
          it("should return all valid and search card", async () => {
            // 準備
            const compareData7 = { cardId: 7, storeName: "テスト店名7", benefitName: "テスト特典名7", benefitCount: 1,  expireDate: "2100/08/01", expireFlg: 0, image: "テストイメージ7", tag: "テストタグ7" };
    
            // 実行
            const res1 = await request.get(encodeURI("/users/1/cards?valid=true&word=店名6"));
            request = chai.request(app);
            const res2 = await request.get(encodeURI("/users/1/cards?valid=true&word=特典名7"));
    
            const resData1 = JSON.parse(res1.text);
            const resData2 = JSON.parse(res2.text);
            // 検証
            resData1.length.should.equal(0);
            resData2.length.should.equal(1);
            resData2[0].should.deep.equal(compareData7);
          });

    });

    // 【POST】カード登録API
    describe("POST /users/:user_id/cards - Add Card", () => {
      // 正常系
      it("should Add a Card", async () => {
        // 準備 
        const randomNum = Math.floor(Math.random() * 1000);
        const addData = { 
                storeName: "POSTテストNo.1店名"+randomNum,
                benefitName: "テスト特典名",
                benefitCount: 10,
                expireDate: "2023/12/31",
                image: "testImage.png",
                tag: "#テストタグ#テストタグ2#テストタグ3"
              };

        // 実行
        const resPost = await request.post("/users/2/cards").send(addData);
        const resPostData = JSON.parse(resPost.text);

        //検証準備
        request = chai.request(app);
        const resGet = await request.get("/users/2/cards");
        const resData = JSON.parse(resGet.text);
        // [object Object]となっているので、配列に変換する。
        const targetData = resData.filter((data) => data.storeName == addData.storeName);

        //検証
        resPost.should.have.status(201);
        resPostData.should.have.keys("msg","cardId");

        targetData[0].storeName.should.equal(addData.storeName);
        targetData[0].benefitName.should.equal(addData.benefitName);
        targetData[0].benefitCount.should.equal(addData.benefitCount);
        targetData[0].expireDate.should.equal(addData.expireDate);
        targetData[0].image.should.equal(addData.image);
        targetData[0].tag.should.equal(addData.tag);
      });

      // 正常系 - 対象データが一部なし
      it("should Add card only storeName and expireDate", async () => {
        // 準備
        const addData = {
          storeName: "POSTテストNo.2店名",
          expireDate: "2024/01/02",
        };

        // 実行
        const resPost = await request.post("/users/2/cards").send(addData);
        request = chai.request(app);
        const resGet = await request.get("/users/2/cards");
        const resData = JSON.parse(resGet.text);
        const targetData = resData.filter((data) => data.storeName == addData.storeName);

        //検証
        resPost.should.have.status(201);

        targetData[0].storeName.should.equal(addData.storeName);
        targetData[0].expireDate.should.equal(addData.expireDate);
      });

      // 異常系 - リクエストデータの型誤り
      it("should return Status 400 because request data is invalid format", async () => {
        // 準備
        const nonRegularData1 = { storeName: 123, benefitName: "テスト特典名", benefitCount: 10, expireDate: "2023/12/31", image: "testImage.png", tag: "#テストタグ#テストタグ2#テストタグ3" };
        const nonRegularData2 = { storeName: "POSTテストNo.3店名", benefitName: 123, benefitCount: 10, expireDate: "2023/12/31", image: "testImage.png", tag: "#テストタグ#テストタグ2#テストタグ3" };
        const nonRegularData3 = { storeName: "POSTテストNo.3店名", benefitName: "テスト特典名", benefitCount: "10", expireDate: "2023/12/31", image: "testImage.png", tag: "#テストタグ#テストタグ2#テストタグ3" };
        const nonRegularData4 = { storeName: "POSTテストNo.3店名", benefitName: "テスト特典名", benefitCount: 10, expireDate: 123, image: "testImage.png", tag: "#テストタグ#テストタグ2#テストタグ3" };
        const nonRegularData5 = { storeName: "POSTテストNo.3店名", benefitName: "テスト特典名", benefitCount: 10, expireDate: "2023/12/31", image: 123, tag: "#テストタグ#テストタグ2#テストタグ3" };
        const nonRegularData6 = { storeName: "POSTテストNo.3店名", benefitName: "テスト特典名", benefitCount: 10, expireDate: "2023/12/31", image: "testImage.png", tag: 123 };
        // 実行
        const res1 = await request.post("/users/2/cards").send(nonRegularData1);
        request = chai.request(app);
        const res2 = await request.post("/users/2/cards").send(nonRegularData2);
        request = chai.request(app);
        const res3 = await request.post("/users/2/cards").send(nonRegularData3);
        request = chai.request(app);
        const res4 = await request.post("/users/2/cards").send(nonRegularData4);
        request = chai.request(app);
        const res5 = await request.post("/users/2/cards").send(nonRegularData5);
        request = chai.request(app);
        const res6 = await request.post("/users/2/cards").send(nonRegularData6);

        //検証
        res1.should.have.status(400);
        res2.should.have.status(400);
        res3.should.have.status(400);
        res4.should.have.status(400);
        res5.should.have.status(400);
        res6.should.have.status(400);
      });

      // 異常系 - リクエストデータの桁数誤り
      it("should return Status 400 because request data is invalid length", async () => {
        // 100文字の文字列を作成
        const LONGSTR_100 = "a".repeat(100);
        const LONGSTR_101 = "a".repeat(101);
        const LONGSTR_255 = "a".repeat(255);
        const LONGSTR_256 = "a".repeat(256);
        
        // 準備
        const nonRegularData1 = { storeName: LONGSTR_101, benefitName: LONGSTR_100, benefitCount: 10, expireDate: "2023/12/31", image: LONGSTR_255, tag: LONGSTR_255 };
        const nonRegularData2 = { storeName: LONGSTR_100, benefitName: LONGSTR_101, benefitCount: 100, expireDate: "2023/12/31", image: LONGSTR_255, tag: LONGSTR_255 };
        const nonRegularData3 = { storeName: LONGSTR_100, benefitName: LONGSTR_100, benefitCount: 1000, expireDate: "2023/12/31", image: LONGSTR_255, tag: LONGSTR_255 };
        const nonRegularData4 = { storeName: LONGSTR_100, benefitName: LONGSTR_100, benefitCount: -1, expireDate: "2023/12/31", image: LONGSTR_255, tag: LONGSTR_255 };
        const nonRegularData5 = { storeName: LONGSTR_100, benefitName: LONGSTR_100, benefitCount: 999, expireDate: "2023/12/31", image: LONGSTR_256, tag: LONGSTR_255 };
        const nonRegularData6 = { storeName: LONGSTR_100, benefitName: LONGSTR_100, benefitCount: 10, expireDate: "2023/12/31", image: LONGSTR_255, tag: LONGSTR_256 };
        // 実行
        const res1 = await request.post("/users/2/cards").send(nonRegularData1);
        request = chai.request(app);
        const res2 = await request.post("/users/2/cards").send(nonRegularData2);
        request = chai.request(app);
        const res3 = await request.post("/users/2/cards").send(nonRegularData3);
        request = chai.request(app);
        const res4 = await request.post("/users/2/cards").send(nonRegularData4);
        request = chai.request(app);
        const res5 = await request.post("/users/2/cards").send(nonRegularData5);
        request = chai.request(app);
        const res6 = await request.post("/users/2/cards").send(nonRegularData6);

        //検証
        res1.should.have.status(400);
        res2.should.have.status(400);
        res3.should.have.status(400);
        res4.should.have.status(400);
        res5.should.have.status(400);
        res6.should.have.status(400);
      });

    });

    // // 【PATCH】カード登録内容の修正API
    describe("PATCH /users/:user_id/cards/:card_id- Update Record", () => {
      // 正常系
      it("should Update a Record", async () => {
        // #準備
        // ##パッチデータ
        // ３桁のランダムな数字とその文字列を作成
        const randomNum = Math.floor(Math.random() * 1000);
        const patchData = { 
          storeName: "PATCHテストNo.1店名"+randomNum,
          benefitName: "PATCHテスト特典名"+randomNum,
          benefitCount: randomNum,
          expireDate: "2"+randomNum+"/12/31",
          image: "PathcTestImage"+randomNum+".png",
          tag: "#テストタグ_"+randomNum
        };
        // ##既存データのID取得
        const resGet = await request.get("/users/2/cards");
        const resData = JSON.parse(resGet.text);
        const targetRecordId = resData[0].cardId;

        // 実行
        request = chai.request(app);
        const resPatch = await request
          .patch("/users/2/cards?cardId=" + targetRecordId)
          .send(patchData);

        // 検証準備
        request = chai.request(app);
        const resGet2 = await request.get("/users/2/cards");
        const resData2 = JSON.parse(resGet2.text);
        const targetRecord = resData2.filter(
          (data) => data.cardId == targetRecordId
        );
        //検証
        resPatch.should.have.status(201);
        targetRecord[0].storeName.should.equal(patchData.storeName);
        targetRecord[0].benefitName.should.equal(patchData.benefitName);
        targetRecord[0].benefitCount.should.equal(patchData.benefitCount);
        targetRecord[0].expireDate.should.equal(patchData.expireDate);
        targetRecord[0].image.should.equal(patchData.image);
        targetRecord[0].tag.should.equal(patchData.tag);        
      });

      // 異常系 - リクエストデータの型誤り
      it("should return Status 400 because request data is invalid format", async () => {
        // 準備
        const nonRegularData1 = { storeName: 123, benefitName: "テスト特典名", benefitCount: 10, expireDate: "2023/12/31", image: "testImage.png", tag: "#テストタグ#テストタグ2#テストタグ3" };
        const nonRegularData2 = { storeName: "PATCHテストNo.1店名", benefitName: 123, benefitCount: 10, expireDate: "2023/12/31", image: "testImage.png", tag: "#テストタグ#テストタグ2#テストタグ3" };
        const nonRegularData3 = { storeName: "PATCHテストNo.1店名", benefitName: "テスト特典名", benefitCount: "10", expireDate: "2023/12/31", image: "testImage.png", tag: "#テストタグ#テストタグ2#テストタグ3" };
        const nonRegularData4 = { storeName: "PATCHテストNo.1店名", benefitName: "テスト特典名", benefitCount: 10, expireDate: 123, image: "testImage.png", tag: "#テストタグ#テストタグ2#テストタグ3" };
        const nonRegularData5 = { storeName: "PATCHテストNo.1店名", benefitName: "テスト特典名", benefitCount: 10, expireDate: "2023/12/31", image: 123, tag: "#テストタグ#テストタグ2#テストタグ3" };
        const nonRegularData6 = { storeName: "PATCHテストNo.1店名", benefitName: "テスト特典名", benefitCount: 10, expireDate: "2023/12/31", image: "testImage.png", tag: 123 };
        // 実行
        const res1 = await request.patch("/users/2/cards?cardId=1").send(nonRegularData1);
        request = chai.request(app);
        const res2 = await request.patch("/users/2/cards?cardId=1").send(nonRegularData2);
        request = chai.request(app);
        const res3 = await request.patch("/users/2/cards?cardId=1").send(nonRegularData3);
        request = chai.request(app);
        const res4 = await request.patch("/users/2/cards?cardId=1").send(nonRegularData4);
        request = chai.request(app);
        const res5 = await request.patch("/users/2/cards?cardId=1").send(nonRegularData5);
        request = chai.request(app);
        const res6 = await request.patch("/users/2/cards?cardId=1").send(nonRegularData6);

        //検証
        res1.should.have.status(400);
        res2.should.have.status(400);
        res3.should.have.status(400);
        res4.should.have.status(400);
        res5.should.have.status(400);
        res6.should.have.status(400);

      });

      // 異常系 - リクエストデータの桁数誤り
      it("should return Status 400 because request data is invalid length", async () => {
        // 100文字の文字列を作成
        const LONGSTR_100 = "a".repeat(100);
        const LONGSTR_101 = "a".repeat(101);
        const LONGSTR_255 = "a".repeat(255);
        const LONGSTR_256 = "a".repeat(256);
        
        // 準備
        const nonRegularData1 = { storeName: LONGSTR_101, benefitName: LONGSTR_100, benefitCount: 10, expireDate: "2023/12/31", image: LONGSTR_255, tag: LONGSTR_255 };
        const nonRegularData2 = { storeName: LONGSTR_100, benefitName: LONGSTR_101, benefitCount: 100, expireDate: "2023/12/31", image: LONGSTR_255, tag: LONGSTR_255 };
        const nonRegularData3 = { storeName: LONGSTR_100, benefitName: LONGSTR_100, benefitCount: 1000, expireDate: "2023/12/31", image: LONGSTR_255, tag: LONGSTR_255 };
        const nonRegularData4 = { storeName: LONGSTR_100, benefitName: LONGSTR_100, benefitCount: -1, expireDate: "2023/12/31", image: LONGSTR_255, tag: LONGSTR_255 };
        const nonRegularData5 = { storeName: LONGSTR_100, benefitName: LONGSTR_100, benefitCount: 999, expireDate: "2023/12/31", image: LONGSTR_256, tag: LONGSTR_255 };
        const nonRegularData6 = { storeName: LONGSTR_100, benefitName: LONGSTR_100, benefitCount: 10, expireDate: "2023/12/31", image: LONGSTR_255, tag: LONGSTR_256 };
        // 実行
        const res1 = await request.patch("/users/2/cards?cardId=1").send(nonRegularData1);
        request = chai.request(app);
        const res2 = await request.patch("/users/2/cards?cardId=1").send(nonRegularData2);
        request = chai.request(app);
        const res3 = await request.patch("/users/2/cards?cardId=1").send(nonRegularData3);
        request = chai.request(app);
        const res4 = await request.patch("/users/2/cards?cardId=1").send(nonRegularData4);
        request = chai.request(app);
        const res5 = await request.patch("/users/2/cards?cardId=1").send(nonRegularData5);
        request = chai.request(app);
        const res6 = await request.patch("/users/2/cards?cardId=1").send(nonRegularData6);

        //検証
        res1.should.have.status(400);
        res2.should.have.status(400);
        res3.should.have.status(400);
        res4.should.have.status(400);
        res5.should.have.status(400);
        res6.should.have.status(400);
      });
      // 異常系 - 対象データなし
      it("should return Status 404", async () => {
        const patchData = { 
          storeName: "PATCHテストNo.4店名",
          benefitName: "PATCHテスト特典名",
          benefitCount: 100,
          expireDate: "2001/12/31",
          image: "PathcTestImage.png",
          tag: "#テストタグ_"
        };
        // 実行
        const res = await request.patch("/users/4/cards?cardId=999").send(patchData);

        //検証
        res.should.have.status(404);
      });
    });

    // 【DELETE】カードの削除API
    describe("DELETE /users/:user_id/cards?cardId=X - Delete Record", () => {
      // 正常系
      it("should Delete a Record", async () => {
        // 準備
        const randomNum = Math.floor(Math.random() * 1000);
        const addData = { 
                storeName: "DELETEテストNo.1店名"+randomNum,
                benefitName: "テスト特典名",
                benefitCount: 10,
                expireDate: "2023/12/31",
                image: "testImage.png",
                tag: "#テストタグ#テストタグ2#テストタグ3"
              };
        const resPost = await request.post("/users/2/cards").send(addData);
        const resPostData = JSON.parse(resPost.text);
        const targetRecordId = resPostData.cardId;

        request = chai.request(app);
        const resGet = await request.get("/users/2/cards");
        const resData = JSON.parse(resGet.text);
        const targetRecord = resData.filter((data)=>data.cardId == resPostData.cardId);
        
        // 実行
        request = chai.request(app);
        const resDelete = await request.delete(
          "/users/2/cards?cardId=" + targetRecordId
        );
        const resDeleteData = JSON.parse(resDelete.text);

        // 検証準備
        request = chai.request(app);
        const resGet2 = await request.get("/users/2/cards");
        const resData2 = JSON.parse(resGet2.text);
        const targetRecord2 = resData2.filter((data)=>data.cardId == resPostData.cardId);

        //検証
        resDelete.should.have.status(201);
        resDeleteData.should.have.keys("msg","result");
        targetRecord[0].expireFlg.should.equal(0);
        targetRecord2[0].expireFlg.should.equal(1);
      });

      // 異常系 - 対象データなし
      it("should return Status 404", async () => {
        // 実行
        const res = await request.delete("/users/4/cards?cardId=999");

        //検証
        res.should.have.status(404);
      });
    });
  });
});
