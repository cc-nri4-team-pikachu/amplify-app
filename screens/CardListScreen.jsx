import React from 'react';
import {useState} from 'react';
import {ScrollView, View, TouchableOpacity} from 'react-native';
import {Modal, Button, WhiteSpace, Provider} from '@ant-design/react-native';
import SingleCard from './SingleCard';
import {RegisterSingleCard} from './RegisterSingleCard';
import Icon from 'react-native-vector-icons/AntDesign';
import {StyleSheet} from 'react-native';
import {blue} from '@ant-design/colors';

export const CardListScreen = () => {
  const allCard = [
    {title: '唐揚げ', expireDate: '2020/12/31'},
    {title: '温泉', expireDate: '2021/1/31'},
    {title: '美容室', expireDate: '2022/2/28'},
    {title: '美容室', expireDate: '2022/2/28'},
    {title: '美容室', expireDate: '2022/2/28'},
  ];

  const [modalVisible, setModalVisible] = useState(false);
  const [storeName, setStoreName] = useState('');
  const [expireDate, setExpireDate] = useState('');

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

  const handleSubmmit = () => {
    //ToDo 店舗情報登録APIの呼び出し
    console.log(storeName);
    console.log(expireDate);

    PushNotification.localNotificationSchedule({
      channelId: 'test-channel',
      title: 'schedule',
      message: 'Good!',
      date: new Date(Date.now() + 20 * 1000),
      allowWhileIdle: true,
    });

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
              title={card.title}
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
            hideModal={hideModal}></RegisterSingleCard>
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
