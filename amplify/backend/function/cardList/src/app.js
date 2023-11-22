/*
Copyright 2017 - 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and limitations under the License.
*/


/* Amplify Params - DO NOT EDIT
	ENV
	REGION
	HOST
Amplify Params - DO NOT EDIT */

const express = require('express');
const bodyParser = require('body-parser');
const model = require('./model');
const awsServerlessExpressMiddleware = require('aws-serverless-express/middleware');

// Timezoneを日本時間に設定
const formatDate = function (date) {
  return date.toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
};


// declare a new express app
  const app = express();
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  console.log(process.env.ENV);
  if (process.env.ENV === "development") {
      
    // Express middlewareでヘッダーを追加する
    app.use((req, res, next) => {
      // AWS Lambdaのイベントに似たヘッダーを追加する
      req.headers['x-apigateway-event'] = JSON.stringify({
        msg:"success"
        /* ここにイベント情報を模倣するオブジェクトを記述 */
      });

      // AWS Lambdaのコンテキストに似たヘッダーを追加する
      req.headers['x-apigateway-context'] = JSON.stringify({
        /* ここにコンテキスト情報を模倣するオブジェクトを記述 */
        msg:"success"
      });


      next();
    });
  }else{
    app.use(awsServerlessExpressMiddleware.eventContext());
  }


  // Enable CORS for all methods

  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "*");
    next();
  });


  /**********************
   * Example get method *
   **********************/

  app.get('/users/:userId/cards', function(req, res) {
    // userIdに紐づくカード情報を取得
    const userId = req.params.userId;
    let result = [];
    // クエリパラメータが存在し、trueの場合は有効期限内のカード情報を取得
    // if(req.query.valid && req.query.valid == "true"){
      // result = model.getValidCardList(userId);
    // }else{
      result = model.getCardList(userId).then((result) => {
        console.log("Promise ",result);
        result.map((card) => {
          card.expire_date = formatDate(card.expire_date);
        })
        res.status(201).json(result);
      }).catch((err) => {
        res.status(500).json({msg:"error",err:err});
      });
  });

  app.post('/users/:userId/cards', function(req, res) {
    // 新規にカード情報を登録
    const userId = req.params.userId;
    const card = req.body;
    const result = model.addCard(userId, card);
    res.status(201).json({msg:"success",result:result});
  });

  app.delete('/users/:userId/cards/cardId', function(req, res) {
    // カード情報を削除
    const userId = req.params.userId;
    const cardId = req.params.cardId;
    const result = model.deleteCard(userId, cardId);
    res.status(201).json({msg:"success",result:result});
  });

  app.put('/users/:userId/cards/:cardId', function(req, res) {
    // カード情報を更新
    const userId = req.params.userId;
    const cardId = req.params.cardId;
    const card = req.body;
    const result = model.updateCard(userId, cardId, card);
    res.status(201).json({msg:"success",result:result});
  });

  app.listen(3000, function() {
      console.log("App started")
  });

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = {app}
