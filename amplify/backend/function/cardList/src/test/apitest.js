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
        const compareData1 =     {
          card_id: 1,
          store_name: "テスト店名",
          benefit_name: "テスト特典名",
          benefit_count: 10,
          expire_date: "2000/01/01",
          image: "テストイメージ",
          tag: "テストタグ",
        }
        const compareData2 =     {
          card_id: 2,
          store_name: "テスト店名2",
          benefit_name: "テスト特典名2",
          benefit_count: 11,
          expire_date: "2100/02/01",
          image: "テストイメージ2",
          tag: "テストタグ2",
        }
        const compareData3 =     {
          card_id: 3,
          store_name: "テスト店名3",
          benefit_name: "テスト特典名3",
          benefit_count: 12,
          expire_date: "2100/03/01",
          image: "テストイメージ3",
          tag: "テストタグ3",
        }
        const compareData4 =     
        {
          card_id: 4,
          store_name: "テスト店名4",
          benefit_name: "テスト特典名4",
          benefit_count: 13,
          expire_date: "2100/06/01",
          image: "テストイメージ4",
          tag: "テストタグ4",
        }
        const compareData5 =
        {
          card_id: 5,
          store_name: "テスト店名5",
          benefit_name: "テスト特典名5",
          benefit_count: 14,
          expire_date: "2100/05/01",
          image: "テストイメージ5",
          tag: "テストタグ5",
        }
        const compareData7 =
        {
          card_id: 7,
          store_name: "テスト店名7",
          benefit_name: "テスト特典名7",
          benefit_count: 1,
          expire_date: "2100/08/01",
          image: "テストイメージ7",
          tag: "テストタグ7",
        }

        // 実行
        const res = await request.get("/users/1/cards");
        const resData = JSON.parse(res.text);
        console.log(res.text);

        // 検証
        res.should.be.json;
        resData[0].should.deep.equal(compareData1);
        // resData.records[1].should.deep.equal(compareData2);
        // resData.records[2].should.deep.equal(compareData3);
        // resData.records[3].should.deep.equal(compareData4);
        // resData.records[4].should.deep.equal(compareData5);
        // resData.records[5].should.deep.equal(compareData7);
      });

      // // 異常系 - 0件検証
      // it("should return empty", async () => {
      //   // 実行
      //   const res = await request.get("/users/0/books/0");
      //   const resData = JSON.parse(res.text);

      //   //検証
      //   resData.should.deep.equal({ records: [] });
      // });

      // // 異常系 - パラメータ不備
      // it("should return Status 400", async () => {
      //   // 実行
      //   const res = await request.get("/users/AAA/books/AAA");

      //   //検証
      //   res.should.have.status(400);
      // });
    });

    // // 【POST】読書の記録投稿API
    // describe("POST /users/:user_id/books/:book_id - Add Record per book", () => {
    //   // 正常系
    //   it("should Add a Record", async () => {
    //     // 準備
    //     const addData = {
    //       date: "2023/11/14",
    //       time: 200,
    //       place: "cafe",
    //       review: 1.0,
    //     };

    //     // 実行
    //     const resPost = await request.post("/users/2/books/6").send(addData);

    //     //検証準備
    //     request = chai.request(server);
    //     const resGet = await request.get("/users/2/books/6");
    //     const resData = JSON.parse(resGet.text);

    //     //検証
    //     resPost.should.have.status(200);

    //     resData.records[resData.records.length - 1].book_id.should.equal(6);
    //     resData.records[resData.records.length - 1].date.should.equal(
    //       addData.date
    //     );
    //     resData.records[resData.records.length - 1].time.should.equal(
    //       addData.time
    //     );
    //     resData.records[resData.records.length - 1].place.should.equal(
    //       addData.place
    //     );
    //     resData.records[resData.records.length - 1].review.should.equal(
    //       addData.review
    //     );
    //   });

    //   // 異常系 - 対象データなし
    //   it("should return Status 404", async () => {
    //     // 準備
    //     const addData = {
    //       date: "2023/11/14",
    //       time: 200,
    //       place: "cafe",
    //       review: 1.0,
    //     };
    //     // 実行
    //     const res = await request.post("/users/0/books/0").send(addData);

    //     //検証
    //     res.should.have.status(404);
    //   });

    //   // 異常系 - リクエストデータの型誤り
    //   it("should return Status 400", async () => {
    //     // 準備
    //     const nonRegularData = {
    //       date: "2023/11/14",
    //       time: "AAA",
    //       place: 100,
    //       review: "A",
    //     };

    //     // 実行
    //     const res = await request.post("/users/2/books/6").send(nonRegularData);

    //     //検証
    //     res.should.have.status(400);
    //   });
    // });

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
