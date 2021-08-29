/**
 * If you are not familiar with React Navigation, check out the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */
import { NavigationContainer, DefaultTheme, DarkTheme } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import  React,{useEffect} from 'react';
import { ColorSchemeName } from 'react-native';

import NotFoundScreen from '../screens/NotFoundScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { RootStackParamList } from '../types';
import BottomTabNavigator from './BottomTabNavigator';
import LinkingConfiguration from './LinkingConfiguration';

export default function Navigation({ colorScheme,...props}: { colorScheme: ColorSchemeName }) {
  return (
    <NavigationContainer independent={true}
      linking={LinkingConfiguration}
      theme={DefaultTheme}>
      <RootNavigator  expoPushToken={props.expoPushToken}
	  tokenChanger={props.tokenChanger} guestChanger={props.guestChanger} guest={props.guest} token={props.token}/>
    </NavigationContainer>
  );
}

// A root stack navigator is often used for displaying modals on top of all other content
// Read more here: https://reactnavigation.org/docs/modal
const Stack = createStackNavigator();

function RootNavigator(props) {
	//useEffect(()=>{console.log(props);})
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Root">
		{propss => <BottomTabNavigator {...propss} tokenChanger={props.tokenChanger} guestChanger={props.guestChanger} guest={props.guest} token={props.token}/>}
	  </Stack.Screen>
	  <Stack.Screen name="Profile">
		{propss => <ProfileScreen {...propss} expoPushToken={props.expoPushToken} tokenChanger={props.tokenChanger} guestChanger={props.guestChanger} guest={props.guest} token={props.token}/>}
	  </Stack.Screen>
      <Stack.Screen name="NotFound" component={NotFoundScreen} options={{ title: 'Oops!' }} />
    </Stack.Navigator>
  );
}
