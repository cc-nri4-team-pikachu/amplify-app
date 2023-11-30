import React, {useLayoutEffect, useState} from 'react';
import {Text, View, Image} from 'react-native';
import {Button, InputItem} from '@ant-design/react-native';
import {blue} from '@ant-design/colors';

function EditCard(props) {
  const storeName = props.storeName;
  const expireDate = props.expireDate;
  const benefitName = props.benefitName;
  const tagName = props.tagName;
  const benefitCount = props.benefitCount;
  const handleUpdate = props.handleUpdate;
  const hideEditModal = props.hideEditModal;
  const [newBenefitCount, setNewBenefitCount] = useState(benefitCount);
  const [newBenefitName, setNewBenefitName] = useState(benefitName);
  const editCardId = props.cardId;
  const imageSrc = props.imageSrc;

  // const [imageSrc, setImageSrc] = useState(
  //   require('../assets/pointCardTemplate.png'),
  // );

  // TODO : 確定ボタンを押した際に、入力された次回特典と特典までの回数を handleUpdate に渡す.
  // -> handleUpdate(name, count)

  return (
    <View>
      <Image style={{width: 215, height: 120}} source={imageSrc} />
      <Text style={{fontSize: 24}}> {storeName} </Text>
      <Text style={{marginTop: 8, marginBottom: 6}}>#{tagName}</Text>
      <Text style={{marginTop: 4, marginBottom: 10}}>
        有効期限: {expireDate}
      </Text>
      <Text style={{marginBottom: 10}}>次回特典:</Text>
      <InputItem
        onChangeText={setNewBenefitName}
        style={{
          borderWidth: 1,
          borderColor: 'gray',
        }}></InputItem>
      <Text style={{marginBottom: 10}}>次回特典まで:</Text>
      <InputItem
        type="number"
        extra={<Text>回</Text>}
        onChangeText={setNewBenefitCount}
        style={{
          marginBottom: 10,
          padding: 10,
          borderWidth: 1,
          borderColor: 'gray',
        }}></InputItem>
      <View
        style={{marginTop: 16, flexDirection: 'row', justifyContent: 'center'}}>
        <Button
          style={{backgroundColor: blue.primary}}
          onPress={() => {
            handleUpdate(newBenefitName, newBenefitCount, editCardId);
            console.log(editCardId);
            hideEditModal();
          }}>
          <Text style={{color: '#FFFFFF'}}>確定</Text>
        </Button>
        <Button style={{marginLeft: 16}} onPress={hideEditModal}>
          <Text> 閉じる </Text>
        </Button>
      </View>
    </View>
  );
}

export default EditCard;
