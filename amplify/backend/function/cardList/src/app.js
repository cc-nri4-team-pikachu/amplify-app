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
//const { type } = require('os');

// Timezoneを日本時間に設定
const formatDate = function (date) {
	return date.toLocaleDateString('ja-JP', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
};

// RequestBodyのバリデーション.問題なしの場合はtrueを返す
const validateRequestCards = function (body) {
	// もしbodyにtime, place, reviewが存在する場合、それぞれを変数に格納
	// 存在しない場合は初期値を設定
	const {
		storeName = 'str',
		benefitName = 'str',
		benefitCount = 0,
		expireDate = '2000-10-10',
		image = 'str',
		tag = 'str'
	} = body;

  // expireDateのバリデーションをしたい。例えば、１２３とか入れたらエラーにしたい。
  const tmpDate = new Date(expireDate);
	const dateFlg = isNaN(tmpDate.getDate());

	if (
    // データ型のバリデーション
		dateFlg ||
    typeof expireDate !== 'string' ||
		typeof storeName !== 'string' ||
		typeof benefitName !== 'string' ||
		typeof benefitCount !== 'number' ||
		typeof image !== 'string' ||
		typeof tag !== 'string'
	) {
		return false;
	} else if(
    // データ長のバリデーション
    storeName.length > 100 ||
    benefitName.length > 100 ||
    benefitCount < 0 ||
    benefitCount > 999 ||
    image.length > 255 ||
    tag.length > 255
  ) {
    return false;
  } else{
		return true;
	}
};

// declare a new express app
const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
if (process.env.ENV === 'development') {
	// Express middlewareでヘッダーを追加する
	app.use((req, res, next) => {
		// AWS Lambdaのイベントに似たヘッダーを追加する
		req.headers['x-apigateway-event'] = JSON.stringify({
			msg: 'success'
			/* ここにイベント情報を模倣するオブジェクトを記述 */
		});

		// AWS Lambdaのコンテキストに似たヘッダーを追加する
		req.headers['x-apigateway-context'] = JSON.stringify({
			/* ここにコンテキスト情報を模倣するオブジェクトを記述 */
			msg: 'success'
		});

		next();
	});
}
 else {
	app.use(awsServerlessExpressMiddleware.eventContext());
}

// Enable CORS for all methods

app.use(function (req, res, next) {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', '*');
	next();
});

app.get('/users/:userId/cards', function (req, res) {
	// userIdに紐づくカード情報を取得
	const userId = req.params.userId;
  console.log("GET!!!!!!!!!");
	let result = [];
	// TODO: クエリパラメータが存在し、trueの場合は有効期限内のカード情報を取得
	// if(req.query.valid && req.query.valid == "true"){
	// result = model.getValidCardList(userId);
	// }else{
	result = model
		.getCardList(userId)
		.then((result) => {
			// 有効期限をYYYY/MM/DD形式に変換
			result.map((card) => {
				card.expireDate = formatDate(card.expireDate);
			});
      console.log(result);
			res.status(200).json(result);
		})
		.catch((err) => {
			// API GatewayにHTTPステータスコード500を返したい
			res.status(500).json({ msg: 'error', err: err });
		});
});

app.post('/users/:userId/cards', function (req, res) {
	// 新規にカード情報を登録
	const userId = req.params.userId;
	const card = req.body;
  console.log("==========================");
  console.log(validateRequestCards(card));
  console.log("==========");
	if (validateRequestCards(card)) {
		const result = model
			.addCard(userId, card)
			.then((result) => {
				res.status(201).json({ msg: 'success', cardId: result });
			})
			.catch((err) => {
				// knexで例外が発生した場合はここに入る
				res.status(500).json({ msg: 'error', err: err });
			});
	} else {
		res.status(400).json({ msg: 'error', err: 'Invalid Request' });
	}
});

app.delete('/users/:userId/cards', function (req, res) {
	// カード情報を削除
	const userId = req.params.userId;
	if(req.query.cardId){
    const cardId = req.query.cardId;
    model.deleteCard(userId, cardId)
          .then((result) => {
            res.status(201).json({ msg: 'success', result: result });
          })
          .catch((err) => {
            // knexで例外が発生した場合はここに入る
            res.status(500).json({ msg: 'error', err: err });
          });
  }else{
    res.status(400).json({ msg: 'error', err: 'Invalid Request' });
  }
});

app.put('/users/:userId/cards', function (req, res) {
	// カード情報を更新
	const userId = req.params.userId;
	if(req.query.cardId){
    const cardId = req.query.cardId;
    const card = req.body;

    if(validateRequestCards(card) == false){
      res.status(400).json({ msg: 'error', err: 'Invalid Request' });
    }
    model.updateCard(userId, cardId, card)
          .then((result) => {
            res.status(201).json({ msg: 'success', result: result });
          })
          .catch((err) => {
            // knexで例外が発生した場合はここに入る
            res.status(500).json({ msg: 'error', err: err });
          });
  }else{
    res.status(400).json({ msg: 'error', err: 'Invalid Request' });
  }
});

app.listen(3000, function () {
	console.log('App started');
});

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
module.exports = app;
