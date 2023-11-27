import React, {useState, useEffect} from 'react';
import {ScrollView, View, TouchableOpacity, Text} from 'react-native';
import {Modal, Button, WhiteSpace, Provider} from '@ant-design/react-native';
import SingleCard from './SingleCard';
import {RegisterSingleCard} from './RegisterSingleCard';
import Icon from 'react-native-vector-icons/AntDesign';
import {StyleSheet} from 'react-native';
import {blue} from '@ant-design/colors';
import PushNotification from 'react-native-push-notification';
import moment from 'moment';
import {Auth} from 'aws-amplify';

require('moment-timezone');
moment.tz.setDefault('Asia/Tokyo');

const initAllCard = [
  {storeName: '唐揚げ', expireDate: '2020/12/31'},
  {storeName: '温泉', expireDate: '2021/1/31'},
  {storeName: '美容室', expireDate: '2022/2/28'},
  {storeName: '美容室', expireDate: '2022/2/28'},
  {storeName: '美容室', expireDate: '2022/2/28'},
];

const cardApiUri =
  'https://x2knth17r1.execute-api.us-east-1.amazonaws.com/dev/users';

export const CardListScreen = () => {
  const [allCard, setAllCard] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [expireDate, setExpireDate] = useState('');
  const [userId, setUserId] = useState(null);

  const fetchUserInfo = async () => {
    try {
      // Amplify Auth モジュールを使用してユーザー情報を取得

      const user = await Auth.currentAuthenticatedUser();
      // 38-40行目はをuser.userNameを使うように変更する必要がある。（TODO）
      console.log(`${user.username}でログインしました`);
      setUserId(user.username);
      await getMyCard(user.username);
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const getMyCard = async userName => {
    const cardApiUserUri = `${cardApiUri}/${userName}/cards`;

    fetch(cardApiUserUri)
      .then(res => res.json())
      .then(result => {
        // console.log(`userId ${userName} cards: `, result);
        setAllCard(result);
      })
      .catch(error => {
        console.error(error);
      });
  };

  useEffect(() => {
    //取得
    fetchUserInfo();
  }, []);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const handleStoreNameChange = text => {
    setStoreName(text);
  };

  const handleExpireDateChange = text => {
    setExpireDate(text);
  };

  const handleSubmmit = async () => {
    // ToDo 店舗情報登録APIの呼び出し
    console.log(storeName);
    console.log(expireDate);

    const cardApiUserUri = `${cardApiUri}/${userId}/cards`;

    fetch(cardApiUserUri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storeName: storeName,
        expireDate: expireDate,
      }),
    })
      .then(res => res.json())
      .then(result => {
        console.log(result);
        console.log('レスポンス送信');
      })
      .catch(error => {
        console.error(error);
      });

    // scheduler追加
    const expireMoment = moment.tz(expireDate + ' 09:00', 'Asia/Tokyo');
    let notifys = [
      {
        date: expireMoment.clone().subtract(1, 'months').toDate(),
        message: 'のスタンプカードの締切が1カ月前です',
      },
      {
        date: expireMoment.clone().subtract(1, 'w').toDate(),
        message: 'のスタンプカードの締切が1週間前です。予定を立てましょう',
      },
      {
        date: expireMoment.clone().subtract(3, 'd').toDate(),
        message: 'のスタンプカードの締切が3日前です！',
      },
      {
        date: expireMoment.clone().subtract(1, 'd').toDate(),
        message: 'のスタンプカードの締切が1日前です！！',
      },
      {
        date: expireMoment.clone().toDate(),
        message: 'のスタンプカードの締切は今日までです！！',
      },
    ];
    notifys.forEach(notify => {
      console.log('add scheduler: ', notify.date);
      PushNotification.localNotificationSchedule({
        //... You can use all the options from localNotifications
        channelId: 'test-channel',
        title: 'CardKeeper',
        message: `${storeName}${notify.message}`, // (required)
        date: notify.date, // in 60 secs
        allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
      });
    });

    PushNotification.localNotification({
      channelId: 'test-channel',
      title: 'CardKeeper',
      message: 'カードを登録しました。',
    });
    console.log('カード登録しました');

    getMyCard(userId);

    hideModal();
  };

  return (
    <Provider>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View style={{...styles.sortButtonContainer}}>
          <Button
            type="ghost"
            size="small"
            style={{width: 100, marginTop: '5%'}}>
            有効期限順
          </Button>
        </View>
        <WhiteSpace size="sm" />
        <ScrollView style={{display: 'flex', width: 300, position: ''}}>
          {allCard.map((card, index) => (
            <SingleCard
              key={index}
              title={card.storeName}
              expireDate={card.expireDate}
            />
          ))}
        </ScrollView>
        <View style={{...styles.addButtonContainer}}>
          <TouchableOpacity onPress={() => showModal()}>
            <Icon name="pluscircle" size={80} color={blue.primary} />
          </TouchableOpacity>
        </View>
        <Modal
          visible={modalVisible}
          transparent
          onClose={() => hideModal()}
          maskClosable
          style={{padding: 20}}>
          <RegisterSingleCard
            onStoreNameChange={handleStoreNameChange}
            onExpireDateChange={handleExpireDateChange}
            onSubmit={handleSubmmit}
            hideModal={hideModal}
          />
        </Modal>
      </View>
    </Provider>
  );
};

const bottomPercent = '10%';
const rightPercent = '10%';
const styles = StyleSheet.create({
  sortButtonContainer: {
    width: 300,
    alignItems: 'flex-end',
  },

  addButtonContainer: {
    position: 'absolute',
    bottom: bottomPercent,
    right: rightPercent,
  },
});
