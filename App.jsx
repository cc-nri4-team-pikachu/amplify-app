import * as React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {CardListScreen} from './screens/CardListScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {blue} from '@ant-design/colors';
import config from './src/aws-exports';
Amplify.configure(config);
import {withAuthenticator} from 'aws-amplify-react-native';
import {Auth} from 'aws-amplify';
import {Amplify, Hub} from '@aws-amplify/core';

const Stack = createNativeStackNavigator();

const handleSignOut = async () => {
  try {
    const user = await Auth.currentAuthenticatedUser();
    console.log(user.username);
    await Auth.signOut();
    // ログアウト成功時に AuthStateChange イベントを発生させる
    Hub.dispatch('UI Auth', {
      event: 'AuthStateChange',
      message: 'signOut',
    });
  } catch (error) {
    console.error('Error signing out: ', error);
  }
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="CardListScreen"
        // もしログイン画面でタブ表示が不要であれば、CardList要素のoptionsに追加する
        screenOptions={{
          statusBarColor: blue.primary,
          title: 'CardKeeper',
          headerStyle: {backgroundColor: blue.primary},
          headerTitleStyle: {color: blue[1]},
        }}>
        <Stack.Screen
          name="CardList"
          component={CardListScreen}
          options={({navigation}) => ({
            headerBackVisible: false,
            headerRight: () => (
              <TouchableOpacity onPress={handleSignOut}>
                <Text style={{color: blue[1], marginRight: 10}}>
                  ログアウト
                </Text>
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

import {AmplifyTheme} from 'aws-amplify-react-native';

const MyButton = Object.assign({}, AmplifyTheme.button, {
  backgroundColor: blue.primary, // ボタンの背景色を変更
  borderColor: 'darkgreen', // ボーダーの色を変更
  borderRadius: 10, // ボーダーの角丸を変更
});

//TODO 他の要素も色変えたい
const MyTheme = Object.assign({}, AmplifyTheme, {
  button: MyButton,
});

export default withAuthenticator(App, {theme: MyTheme}); //Cognitoの認証
