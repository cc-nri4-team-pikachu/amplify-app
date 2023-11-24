import React from 'react';
import {View, Text} from 'react-native';
import {InputItem, Button} from '@ant-design/react-native';
import {red} from '@ant-design/colors';

export const RegisterSingleCard = ({
  onStoreNameChange,
  onExpireDateChange,
  onSubmit,
  hideModal,
}) => {
  return (
    <View style={{padding: 10}}>
      <View style={{flexDirection: 'row', marginBottom: 10}}>
        <Text>店舗名</Text>
        <Text style={{color: red[4]}}>※</Text>
      </View>
      <InputItem
        clear
        placeholder="例:吉野家"
        onChangeText={onStoreNameChange}
        style={{
          marginBottom: 10,
          padding: 10,
          borderWidth: 1,
          borderColor: 'gray',
        }}
      />
      <Text style={{marginBottom: 10}}>有効期限</Text>
      <InputItem
        clear
        placeholder="例:2023-01-01"
        onChangeText={onExpireDateChange}
        style={{
          marginBottom: 20,
          padding: 10,
          borderWidth: 1,
          borderColor: 'gray',
        }}
      />

      <View style={{flexDirection: 'row', justifyContent: 'center'}}>
        <View style={{marginRight: 10}}>
          <Button
            type="primary"
            size="medium"
            onPress={onSubmit}
            style={{padding: 8}}>
            登録
          </Button>
        </View>
        <Button
          type="ghost"
          size="medium"
          onPress={hideModal}
          style={{padding: 8}}>
          閉じる
        </Button>
      </View>
    </View>
  );
};
