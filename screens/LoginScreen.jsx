import React, {useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {InputItem, Button, WhiteSpace} from '@ant-design/react-native';
import PushNotification from 'react-native-push-notification';

export const LoginScreen = ({navigation}) => {
  const [userName, setUserName] = useState('');
  const [password, setPassword] = useState('');
  useEffect(() => {
    createChannels();
  }, []);

  const handleUserNameChange = value => {
    setUserName(value);
  };

  const handlePasswordChange = value => {
    setPassword(value);
  };

  const createChannels = () => {
    PushNotification.createChannel({
      channelId: 'test-channel',
      channelName: 'Test Channel',
    });
    console.log('create channel');
  };

  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{width: 300, padding: 20, alignItems: 'flex-start'}}>
        <Text style={{fontSize: 30}}>Card Keeper</Text>
        <WhiteSpace size="xl" />
        <Text>ログイン</Text>
        <InputItem clear value={userName} onChange={handleUserNameChange} />
        <Text>パスワード</Text>
        <InputItem clear value={password} onChange={handlePasswordChange} />
        <WhiteSpace size="xl" />
        <View style={{width: '100%', alignItems: 'center'}}>
          <Button
            type="primary"
            onPress={() => navigation.navigate('CardList')}>
            ログイン
          </Button>
          <WhiteSpace size="xl" />
          <TouchableOpacity onPress={() => navigation.navigate('CardList')}>
            <Text style={{color: '#108ee9'}}>サインイン</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};
