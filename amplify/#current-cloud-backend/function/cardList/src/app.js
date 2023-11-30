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

/**
 * @abstract Timezoneを日本時間に設定
 * @param {Date} 変換対象の日付
 * @returns {string} YYYY/MM/DD形式の日付
 */
const formatDate = function (date) {
	return date.toLocaleDateString('ja-JP', {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	});
};

/**
 * @abstract RequestBodyのバリデーション.問題なしの場合はtrueを返す
 * @param {object} リクエストボディを受け取る
 * @returns {boolean} true:正常,false:異常
 */
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

  // Date型に変換できるかどうかで、有効期限のバリデーションを行う
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
		// Localテスト用にAPIGateway用のヘッダーを追加する
		req.headers['x-apigateway-event'] = JSON.stringify({
			msg: 'success'
		});
		req.headers['x-apigateway-context'] = JSON.stringify({
			msg: 'success'
		});

		next();
	});
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
	let result = [];
	let paramObj = {};
	if(req.query.valid !== undefined){
		paramObj.expireFlg = req.query.valid? 0 : 1;
	}
	if (req.query.word) {
		paramObj.word = decodeURIComponent(req.query.word);
	}
	result = model
		.getCardList(userId,paramObj)
		.then((result) => {
			// 有効期限をYYYY/MM/DD形式に変換
			result.map((card) => {
				card.expireDate = formatDate(card.expireDate);
			});
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
			if(result === 0){
				// 対象が存在しない場合はエラーを返す
				res.status(404).json({ msg: 'error', err: 'Target Record Not Found' });
			}
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

app.patch('/users/:userId/cards', function (req, res) {
	// カード情報を更新
	const userId = req.params.userId;
	const cardId = req.query.cardId;
	if(cardId){
		const card = req.body;

		if(!validateRequestCards(card)){
			res.status(400).json({ msg: 'error', err: 'Invalid Request' });
		}
		model.updateCard(userId, cardId, card)
			.then((result) => {
				if(result === 0){
					// 対象が存在しない場合はエラーを返す
					res.status(404).json({ msg: 'error', err: 'Target Record Not Found' });
				}
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
