import React, {useState, useEffect} from 'react';
import {ScrollView, View, TouchableOpacity, Text} from 'react-native';
import {
  Modal,
  Button,
  WhiteSpace,
  Provider,
  InputItem,
  Flex,
} from '@ant-design/react-native';
import SingleCard from './SingleCard';
import EditCard from './EditCard';
import {RegisterSingleCard} from './RegisterSingleCard';
import Icon from 'react-native-vector-icons/AntDesign';
import {StyleSheet} from 'react-native';
import {blue, gray} from '@ant-design/colors';
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
  const [benefitCount, setBenefitCount] = useState('');
  const [benefitName, setBenefitName] = useState('');
  const [tagName, setTagName] = useState('');
  const [userId, setUserId] = useState(null);

  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editIndex, setEditIndex] = useState(-1);
  const [editCardId, setEditCardId] = useState(-1);
  const [editStoreName, setEditStoreName] = useState('Test Store');
  const [editExpireDate, setEditExpireDate] = useState('2000/01/01');
  const [editBenefitName, setEditBenefitName] = useState('Sample Benefit');
  const [editTagName, setEditTagName] = useState('#Tag');
  const [editBenefitCount, setEditBenefitCount] = useState(10);

  const [searchWord, setSearchWord] = useState('');

  const [imageSrc, setImageSrc] = useState(
    require('../assets/pointCardTemplate.png'),
  );

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
        console.log(result);
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

  useEffect(() => {
    if (editIndex === -1) return;

    // if (allCard[editIndex].cardId === 1) {
    //   setImageSrc(require('../assets/IMG_0048.jpg'));
    // } else if (allCard[editIndex].cardId === 28) {
    //   setImageSrc(require('../assets/IMG_0049.jpg'));
    // }

    setImageSrc(require('../assets/IMG_0049.jpg'));

    setEditCardId(allCard[editIndex].cardId);
    setEditStoreName(allCard[editIndex].storeName);
    setEditExpireDate(allCard[editIndex].expireDate);
    setEditBenefitName(allCard[editIndex].benefitName);
    setEditTagName(allCard[editIndex].tag);
    setEditBenefitCount(allCard[editIndex].benefitCount);
  }, [editIndex]);

  const showModal = () => {
    setModalVisible(true);
  };

  const hideModal = () => {
    setModalVisible(false);
  };

  const hideEditModal = () => {
    setShowEditPopup(false);
  };

  const handleStoreNameChange = text => {
    setStoreName(text);
  };

  // const handleExpireDateChange = text => {
  //   setExpireDate(text);
  // };

  const handleExpireDatePickerChange = date => {
    setExpireDate(
      date.getFullYear().toString().padStart(4, '0') +
        '-' +
        (date.getMonth() + 1).toString().padStart(2, '0') +
        '-' +
        date.getDate().toString().padStart(2, '0'),
    );
  };

  const handleBenefitCount = text => {
    setBenefitCount(text);
  };

  const handleBenefitName = text => {
    setBenefitName(text);
  };

  const handleTag = text => {
    setTagName(text);
  };

  const handleUpdate = (
    updateBenefitName,
    updateBenefitCount,
    updateCardId,
  ) => {
    const cardApiUserUri = `${cardApiUri}/${userId}/cards?cardId=${updateCardId}`;

    console.log(
      JSON.stringify({
        benefitName: updateBenefitName,
        benefitCount: parseInt(updateBenefitCount),
      }),
    );

    fetch(cardApiUserUri, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        benefitName: updateBenefitName,
        benefitCount: parseInt(updateBenefitCount),
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

    getMyCard(userId);
  };

  const handleSubmmit = async () => {
    // ToDo 店舗情報登録APIの呼び出し
    console.log(storeName);
    console.log(expireDate);
    console.log(benefitName);
    console.log(benefitCount);

    const cardApiUserUri = `${cardApiUri}/${userId}/cards`;
    console.log(
      JSON.stringify({
        storeName: storeName,
        expireDate: expireDate,
        benefitName: benefitName,
        benefitCount: parseInt(benefitCount),
        tag: tagName,
      }),
    );

    fetch(cardApiUserUri, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        storeName: storeName,
        expireDate: expireDate,
        benefitName: benefitName,
        benefitCount: parseInt(benefitCount),
        tag: tagName,
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

    // // scheduler追加
    // const expireMoment = moment.tz(expireDate + ' 09:00', 'Asia/Tokyo');
    // let notifys = [
    //   {
    //     date: expireMoment.clone().subtract(1, 'months').toDate(),
    //     message: 'のスタンプカードの締切が1カ月前です',
    //   },
    //   {
    //     date: expireMoment.clone().subtract(1, 'w').toDate(),
    //     message: 'のスタンプカードの締切が1週間前です。予定を立てましょう',
    //   },
    //   {
    //     date: expireMoment.clone().subtract(3, 'd').toDate(),
    //     message: 'のスタンプカードの締切が3日前です！',
    //   },
    //   {
    //     date: expireMoment.clone().subtract(1, 'd').toDate(),
    //     message: 'のスタンプカードの締切が1日前です！！',
    //   },
    //   {
    //     date: expireMoment.clone().toDate(),
    //     message: 'のスタンプカードの締切は今日までです！！',
    //   },
    // ];
    // notifys.forEach(notify => {
    //   console.log('add scheduler: ', notify.date);
    //   PushNotification.localNotificationSchedule({
    //     //... You can use all the options from localNotifications
    //     channelId: 'test-channel',
    //     title: 'CardKeeper',
    //     message: `${storeName}${notify.message}`, // (required)
    //     date: notify.date, // in 60 secs
    //     allowWhileIdle: true, // (optional) set notification to work while on doze, default: false
    //   });
    // });

    // PushNotification.localNotification({
    //   channelId: 'test-channel',
    //   title: 'CardKeeper',
    //   message: 'カードを登録しました。',
    // });
    // console.log('カード登録しました');

    await getMyCard(userId);
    console.log('getMyCard');

    hideModal();
  };

  return (
    <Provider>
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <View
          style={{
            marginTop: 16,
            //flexDirection: 'row',
            alignItems: 'center',
            width: 300,
          }}>
          <InputItem
            placeholder="店舗名orタグ名で検索！"
            clear
            onChangeText={text => setSearchWord(text)}
            style={{
              borderWidth: 1,
              borderColor: 'gray',
              backgroundColor: '#FFFFFF',
              height: 40,
            }}
          />
        </View>
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
          {allCard
            .filter(
              card =>
                card.storeName.includes(searchWord) ||
                card?.tag.includes(searchWord),
            )
            .map((card, index) => (
              <SingleCard
                key={index}
                index={index}
                title={card.storeName}
                expireDate={card.expireDate}
                benefitName={card.benefitName}
                benefitCount={card.benefitCount}
                tag={card.tag}
                setShowEditPopup={setShowEditPopup}
                setEditIndex={setEditIndex}
              />
            ))}
        </ScrollView>
        <View style={{...styles.addButtonContainer}}>
          <TouchableOpacity onPress={() => showModal()}>
            <Icon name="pluscircle" size={60} color={blue.primary} />
          </TouchableOpacity>
        </View>
        <Modal
          visible={modalVisible}
          transparent
          onClose={() => hideModal()}
          maskClosable
          style={{padding: 20}}>
          <RegisterSingleCard
            expireDate={expireDate}
            onStoreNameChange={handleStoreNameChange}
            onExpireDateChange={handleExpireDatePickerChange}
            onBenefitCountChange={handleBenefitCount}
            onBenefitNameChange={handleBenefitName}
            onTagChange={handleTag}
            onSubmit={handleSubmmit}
            hideModal={hideModal}
          />
        </Modal>
        <Modal
          visible={showEditPopup}
          transparent
          onClose={() => hideEditModal()}
          maskClosable
          style={{padding: 20}}>
          <EditCard
            storeName={editStoreName}
            expireDate={editExpireDate}
            benefitName={editBenefitName}
            tagName={editTagName}
            benefitCount={editBenefitCount}
            cardId={editCardId}
            handleUpdate={handleUpdate}
            hideEditModal={hideEditModal}
            imageSrc={imageSrc}
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
    width: 270,
    //alignItems: 'flex-end',
    flexDirection: 'row',
    display: 'flex',
    justifyContent: 'space-between',
  },

  addButtonContainer: {
    position: 'absolute',
    bottom: bottomPercent,
    right: rightPercent,
  },
});
