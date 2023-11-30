import React from 'react';
import {View, Text} from 'react-native';
import {InputItem, Button, List, DatePicker} from '@ant-design/react-native';
import {red, blue, gray} from '@ant-design/colors';

export const RegisterSingleCard = ({
  expireDate,
  onStoreNameChange,
  onExpireDateChange,
  onBenefitCountChange,
  onBenefitNameChange,
  onTagChange,
  onSubmit,
  hideModal,
}) => {
  // const [expireDate, setExpireDate] = React.useState('2023-11-30');

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
      <Text style={{marginBottom: 0}}>有効期限</Text>

      {/* <InputItem
        clear
        placeholder="例:2023-01-01"
        onChangeText={onExpireDateChange}
        style={{
          marginBottom: 10,
          padding: 10,
          borderWidth: 1,
          borderColor: 'gray',
        }}
      /> */}

      <List>
        <DatePicker
          mode="date"
          extra={<Text> 日付を選択 </Text>}
          defaultDate={new Date(2023, 11, 30)}
          minDate={new Date(2000, 1, 1)}
          maxDate={new Date(2040, 12, 31)}
          onChange={onExpireDateChange}
          format="YYYY-MM-DD">
          <List.Item style={{color: gray[4]}}>{expireDate}</List.Item>
        </DatePicker>
      </List>

      <Text style={{marginBottom: 10}}>次回の特典まで</Text>
      <InputItem
        type="number"
        clear
        onChangeText={onBenefitCountChange}
        style={{
          marginBottom: 10,
          padding: 10,
          borderWidth: 1,
          borderColor: 'gray',
        }}
        extra={<Text>回</Text>}
      />
      <Text style={{marginBottom: 16}}>次回の特典内容</Text>
      <InputItem
        clear
        placeholder="例:500円OFF"
        onChangeText={onBenefitNameChange}
        style={{
          marginBottom: 20,
          padding: 10,
          borderWidth: 1,
          borderColor: 'gray',
        }}
      />
      <Text style={{marginBottom: 16}}>タグ</Text>
      <InputItem
        clear
        placeholder="牛丼屋"
        onChangeText={onTagChange}
        style={{
          marginBottom: 20,
          padding: 10,
          borderWidth: 1,
          borderColor: 'gray',
        }}
      />
      <Button
        size="small"
        style={{
          marginTop: 4,
          height: 28,
          backgroundColor: blue.primary,
          marginBottom: 16,
        }}>
        <Text style={{color: '#FFFFFF'}}>画像をアップロード</Text>
      </Button>
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
