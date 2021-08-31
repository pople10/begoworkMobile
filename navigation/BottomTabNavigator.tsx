/**
 * Learn more about createBottomTabNavigator:
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

import { Ionicons,MaterialIcons,AntDesign  } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import React,{useState,useEffect} from 'react';

import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

import WelcomeScreen from '../screens/WelcomeScreen';
import HelpScreen from '../screens/HelpScreen';
import OrderScreen from '../screens/OrderScreen';
import SearchScreen from '../screens/SearchScreen';

import TopBar from '../components/TopBar';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

export default function BottomTabNavigator(props) {
  const colorScheme = "light";
  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      tabBarOptions={{ activeTintColor: Colors["light"].selected ,inactiveTintColor: Colors["light"].backgroundIcons,showLabel: false}}>
      <BottomTab.Screen
        name="Home"
        options={{
          tabBarIcon: ({ color }) => <AntDesign name="home" size={24} color={color} />}}>
		{propss => <WelcomeNavigator {...propss} tokenChanger={props.tokenChanger} guestChanger={props.guestChanger} guest={props.guest} token={props.token}/>}
	  </BottomTab.Screen>
	  <BottomTab.Screen
        name="Search"
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="md-search-outline" color={color} />}}>
		  {propss => <SearchNavigator {...propss} tokenChanger={props.tokenChanger} guestChanger={props.guestChanger} guest={props.guest} token={props.token}/>}
	  </BottomTab.Screen>
	  <BottomTab.Screen
        name="Orders"
        options={{
          tabBarIcon: ({ color }) => <MaterialIcons name="workspaces-outline" size={24} color={color} />}}>
		  {propss => <OrderNavigator {...propss} tokenChanger={props.tokenChanger} guestChanger={props.guestChanger} guest={props.guest} token={props.token}/>}
	  </BottomTab.Screen>
	  <BottomTab.Screen
        name="Help"
        options={{
          tabBarIcon: ({ color }) => <TabBarIcon name="help-circle-outline" color={color} />,}}>
		  {propss => <HelpNavigator {...propss} tokenChanger={props.tokenChanger} guestChanger={props.guestChanger} guest={props.guest} token={props.token}/>}
	  </BottomTab.Screen>
    </BottomTab.Navigator>
  );
}

// You can explore the built-in icon families and icons on the web at:
// https://icons.expo.fyi/
function TabBarIcon(props: { name: React.ComponentProps<typeof Ionicons>['name']; color: string }) {
  return <Ionicons size={30} style={{ marginBottom: -3 }} {...props} />;
}

// Each tab has its own navigation stack, you can read more about this pattern here:
// https://reactnavigation.org/docs/tab-based-navigation#a-stack-navigator-for-each-tab
const Welcome = createStackNavigator();

function WelcomeNavigator(props) {
  return (
    <Welcome.Navigator>
      <Welcome.Screen
        name="HomeScreen"
        options={{ headerTransparent: false, headerTitle: propsssss  => ( <TopBar {...props} /> ) }}
      >
		{propss => <WelcomeScreen {...propss} tokenChanger={props.tokenChanger} guestChanger={props.guestChanger} guest={props.guest} token={props.token}/>}
	  </Welcome.Screen>
    </Welcome.Navigator>
  );
}

const Help = createStackNavigator();

function HelpNavigator(props) {
  return (
    <Help.Navigator>
      <Help.Screen
        name="HelpScreen"
        options={{ headerTransparent: false, headerTitle: propsssss  => ( <TopBar {...props} /> ) }}
      >
		{propss => <HelpScreen {...propss} tokenChanger={props.tokenChanger} guestChanger={props.guestChanger} guest={props.guest} token={props.token}/>}
	  </Help.Screen>
    </Help.Navigator>
  );
}

const Order = createStackNavigator();

function OrderNavigator(props) {
  return (
    <Order.Navigator>
      <Order.Screen
        name="OrderScreen"
        options={{ headerTransparent: false, headerTitle: propsssss  => ( <TopBar {...props} /> ) }}
      >
		{propss => <OrderScreen {...propss} tokenChanger={props.tokenChanger} guestChanger={props.guestChanger} guest={props.guest} token={props.token}/>}
	  </Order.Screen>
    </Order.Navigator>
  );
}


const Search = createStackNavigator();

function SearchNavigator(props) {
  return (
    <Search.Navigator>
      <Search.Screen
        name="SearchScreen"
        options={{ headerTransparent: false, headerTitle: propsssss  => ( <TopBar {...props} /> ) }}
      >
		{propss => <SearchScreen {...propss} tokenChanger={props.tokenChanger} guestChanger={props.guestChanger} guest={props.guest} token={props.token}/>}
	  </Search.Screen>
    </Search.Navigator>
  );
}