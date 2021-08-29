import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import * as React from 'react';

import LoginScreen from '../screens/LoginScreen';
import FirstScreen from '../screens/FirstScreen';
import RegisterScreen from '../screens/RegisterScreen';
import ResetScreen from '../screens/ResetScreen';
import { RootStackParamList } from '../types';
import LinkingConfigurationStarted from './LinkingConfigurationStarted';
import GoBackBar from '../components/GoBackBar';

import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';

const themeCustom = {
  colors: {
    background: '#fff',
  },
};

export default function StartedNavigator(props) {
  return (
    <NavigationContainer independent={true} theme={themeCustom}
      linking={LinkingConfigurationStarted}>
      <RootNavigator expoPushToken={props.expoPushToken} tokenChanger={props.tokenChanger} guestChanger={props.guestChanger}/>
    </NavigationContainer>
  );
}
const Stack = createStackNavigator();

function RootNavigator(globalProps) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: true }} headerMode={'screen'}>
		<Stack.Screen name="First" options={{ headerTransparent: true, header: ({navigation}) => ( <View style={{display:'none'}}></View> ) }}>
			{props => <FirstScreen {...props} tokenChanger={globalProps.tokenChanger} guestChanger={globalProps.guestChanger}/>}
		</Stack.Screen>
		<Stack.Screen name="Login" options={{ headerTransparent: true, header: ({navigation}) => ( <GoBackBar navigation={navigation} /> ) }}>
			{props => <LoginScreen {...props} expoPushToken={globalProps.expoPushToken} tokenChanger={globalProps.tokenChanger} guestChanger={globalProps.guestChanger}/>}
		</Stack.Screen>
		<Stack.Screen name="Register" options={{ headerTransparent: true, header: ({navigation}) => ( <GoBackBar navigation={navigation} /> ), }}>
			{props => <RegisterScreen {...props} expoPushToken={globalProps.expoPushToken} tokenChanger={globalProps.tokenChanger} guestChanger={globalProps.guestChanger}/>}
		</Stack.Screen>
		<Stack.Screen name="Reset" options={{ headerTransparent: true, header: ({navigation}) => ( <GoBackBar navigation={navigation} /> ), }}>
			{props => <ResetScreen {...props} tokenChanger={globalProps.tokenChanger} guestChanger={globalProps.guestChanger}/>}
		</Stack.Screen>
    </Stack.Navigator>
  );
}
