// テストの準備
const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const { app } = require("../app");
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
    // 【GET】読書の記録取得API
    describe("GET /users/:user_id/cards - get all Card", () => {
      // 正常系
      it("should return all card", async () => {
        // 準備
        const compareData1 = { cardId: 1, storeName: "テスト店名",  benefitName: "テスト特典名",  benefitCount: 10, expireDate: "2000/01/01", image: "テストイメージ", tag: "テストタグ" };
        const compareData2 = { cardId: 2, storeName: "テスト店名2", benefitName: "テスト特典名2", benefitCount: 11, expireDate: "2100/02/01", image: "テストイメージ2", tag: "テストタグ2" };
        const compareData3 = { cardId: 3, storeName: "テスト店名3", benefitName: "テスト特典名3", benefitCount: 12, expireDate: "2100/03/01", image: "テストイメージ3", tag: "テストタグ3" };
        const compareData4 = { cardId: 4, storeName: "テスト店名4", benefitName: "テスト特典名4", benefitCount: 13, expireDate: "2100/06/01", image: "テストイメージ4", tag: "テストタグ4" };
        const compareData5 = { cardId: 5, storeName: "テスト店名5", benefitName: "テスト特典名5", benefitCount: 14, expireDate: "2100/05/01", image: "テストイメージ5", tag: "テストタグ5" };
        const compareData7 = { cardId: 7, storeName: "テスト店名7", benefitName: "テスト特典名7", benefitCount: 1,  expireDate: "2100/08/01", image: "テストイメージ7", tag: "テストタグ7" };

        // 実行
        const res = await request.get("/users/1/cards");
        const resData = JSON.parse(res.text);

        // 検証
        res.should.be.json;
        resData.length.should.equal(6);
        resData[0].should.deep.equal(compareData1);
        resData[1].should.deep.equal(compareData2);
        resData[2].should.deep.equal(compareData3);
        // テストデータとして、４より５が先に来るようにしている
        resData[3].should.deep.equal(compareData5);
        resData[4].should.deep.equal(compareData4);
        resData[5].should.deep.equal(compareData7);
      });
    });

    // 【POST】読書の記録投稿API
    describe("POST /users/:user_id/cards - Add Card", () => {
      // 正常系
      it("should Add a Card", async () => {
        // 準備 
        const addData = { 
                storeName: "POSTテストNo.1店名",
                benefitName: "テスト特典名",
                benefitCount: 10,
                expireDate: "2023/12/31",
                image: "testImage.png",
                tag: "#テストタグ#テストタグ2#テストタグ3"
              };

        // 実行
        const resPost = await request.post("/users/2/cards").send(addData);
        console.log("resPost.text: " + resPost.text);

        //検証準備
        request = chai.request(app);
        const resGet = await request.get("/users/2/cards");
        const resData = JSON.parse(resGet.text);
        // [object Object]となっているので、配列に変換する。
        const targetData = resData.filter((data) => 
          data.storeName == addData.storeName
        );
        console.log("targetData: " + targetData[0]);

        //検証
        resPost.should.have.status(201);

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

    // // 【PATCH】読書の記録修正API
    // describe("PATCH /users/:user_id/books/:book_id/records/:redord_id - Update Record", () => {
    //   // 正常系
    //   it("should Update a Record", async () => {
    //     // 準備
    //     const resGet = await request.get("/users/3/books/11");
    //     const resData = JSON.parse(resGet.text);
    //     const targetRecordId = resData.records[0].id;
    //     const patchData = {
    //       date: "2022/11/14",
    //       time: 200,
    //       place: "home",
    //       review: 4.5,
    //     };
    //     const compareData = {
    //       id: targetRecordId,
    //       book_id: 11,
    //       date: "2022/11/14",
    //       time: 200,
    //       place: "home",
    //       review: 4.5,
    //     };

    //     // 実行
    //     request = chai.request(server);
    //     const resPatch = await request
    //       .patch("/users/3/books/11/records/" + targetRecordId)
    //       .send(patchData);

    //     request = chai.request(server);
    //     const resGet2 = await request.get("/users/3/books/11");
    //     const resData2 = JSON.parse(resGet2.text);
    //     //検証
    //     resPatch.should.have.status(200);
    //     //console.log(resData2);
    //     const targetRecord = resData2.records.filter(
    //       (data) => data.id == targetRecordId
    //     );
    //     //console.log("targetId"+targetRecordId);
    //     targetRecord[0].book_id.should.equal(11);
    //     targetRecord[0].date.should.equal(compareData.date);
    //     targetRecord[0].time.should.equal(compareData.time);
    //     targetRecord[0].place.should.equal(compareData.place);
    //     targetRecord[0].review.should.equal(compareData.review);
    //   });

    //   // 異常系 - 対象データなし
    //   it("should return Status 404", async () => {
    //     // 実行
    //     const res = await request.patch("/users/3/books/11/records/0");

    //     //検証
    //     res.should.have.status(404);
    //   });

    //   // 異常系 - リクエストデータの型誤り
    //   it("should return Status 400", async () => {
    //     // 準備
    //     const resGet = await request.get("/users/3/books/11");
    //     const resData = JSON.parse(resGet.text);
    //     const targetRecordId = resData.records[0].id;
    //     const patchData = {
    //       date: "2022/11/14",
    //       time: "AA",
    //       place: 10,
    //       review: "S",
    //     };

    //     // 実行
    //     request = chai.request(server);
    //     const resPatch = await request
    //       .patch("/users/3/books/11/records/" + targetRecordId)
    //       .send(patchData);

    //     //検証
    //     resPatch.should.have.status(400);
    //   });
    // });

    // // 【DELETE】読書の記録削除API
    // describe("DELETE /users/:user_id/books/:book_id/records/:redord_id - Delete Record", () => {
    //   // 正常系
    //   it("should Delete a Record", async () => {
    //     // 準備
    //     const addData = {
    //       date: "2023/11/14",
    //       time: 200,
    //       place: "cafe",
    //       review: 1.0,
    //     };
    //     const resPost = await request.post("/users/3/books/12").send(addData);

    //     request = chai.request(server);
    //     const resGet = await request.get("/users/3/books/12");
    //     const resData = JSON.parse(resGet.text);
    //     const targetRecordId = resData.records[0].id;

    //     // 実行
    //     request = chai.request(server);
    //     const res = await request.delete(
    //       "/users/3/books/12/records/" + targetRecordId
    //     );

    //     //検証
    //     res.should.have.status(200);
    //   });

    //   // 異常系 - 対象データなし
    //   it("should return Status 404", async () => {
    //     // 実行
    //     const res = await request.delete("/users/4/books/160/records/0");

    //     //検証
    //     res.should.have.status(404);
    //   });
    //});
  });
});
