import * as React from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {LoginScreen} from './screens/LoginScreen';
import {CardListScreen} from './screens/CardListScreen';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {blue} from '@ant-design/colors';
import Amplify from '@aws-amplify/core';
import config from './src/aws-exports';
Amplify.configure(config);
import {withAuthenticator} from 'aws-amplify-react-native';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Login"
        // もしログイン画面でタブ表示が不要であれば、CardList要素のoptionsに追加する
        screenOptions={{
          statusBarColor: blue.primary,
          title: 'CardKeeper',
          headerStyle: {backgroundColor: blue.primary},
          headerTitleStyle: {color: blue[1]},
        }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen
          name="CardList"
          component={CardListScreen}
          options={({navigation}) => ({
            headerBackVisible: false,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Login'); // ログイン画面に戻る
                }}>
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
//export default App;
export default withAuthenticator(App);
