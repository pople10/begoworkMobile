import 'react-native-gesture-handler';
import { StatusBar } from 'expo-status-bar';
import React, {useEffect,useState,useRef} from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {SafeAreaView,Text,Linking,Platform } from 'react-native';
import { Overlay } from 'react-native-elements';
import NetInfo from "@react-native-community/netinfo";
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AnimatedSplash from "react-native-animated-splash-screen";

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';
import StartedNavigator from './navigation/StartedNavigator';
import ClientArea from './screens/ClientArea';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});


function App() {
  const isLoadingComplete = useCachedResources();
  const colorScheme = useColorScheme();
  const [token,setToken]=useState(null);
  const [guest,setGuest]=useState(false);
  const [connected,setConnected]=useState(false);
  
  const [expoPushToken, setExpoPushToken] = useState('');
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  
  const AreaComp = ()=> {return (
				<ClientArea expoPushToken={expoPushToken} tokenChanger={setToken} guestChanger={setGuest} guest={guest} token={token} colorScheme={"light"} />
			);};
  useEffect(()=>{
	  //console.log(guest);
		getToken();
		const unsubscribe = NetInfo.addEventListener(state => {
		  setConnected(state.isConnected);
		});
		 
		return ()=>{unsubscribe()};
  });
  
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => setExpoPushToken(token));

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });
    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
  
  const getToken = async function()
	  {
		/*setGuest(false);
		try { await AsyncStorage.removeItem("token");console.log("deleted"); } catch(exception) { console.log("sssdd"); }	*/
		
		try {
			const value = await AsyncStorage.getItem('token');
			setToken(value);
			/*const value2 = await AsyncStorage.getItem('guest');
			if(value2)
				setGuest(JSON.parse(value2.toLowerCase()));*/
		} catch(e) {
			//return null;
		}
	  }  
	async function sendPushNotification(expoPushToken) {
	  const message = {
		to: expoPushToken,
		sound: 'default',
		title: 'Original Title',
		body: 'And here is the body!',
		data: { someData: 'goes here' },
	  };

	  await fetch('https://exp.host/--/api/v2/push/send', {
		method: 'POST',
		headers: {
		  Accept: 'application/json',
		  'Accept-encoding': 'gzip, deflate',
		  'Content-Type': 'application/json',
		},
		body: JSON.stringify(message),
	  });
	}

	async function registerForPushNotificationsAsync() {
	  let token;
	  if (Constants.isDevice) {
		const { status: existingStatus } = await Notifications.getPermissionsAsync();
		let finalStatus = existingStatus;
		if (existingStatus !== 'granted') {
		  const { status } = await Notifications.requestPermissionsAsync();
		  finalStatus = status;
		}
		if (finalStatus !== 'granted') {
		  alert('Failed to get push token for push notification!');
		  return;
		}
		token = (await Notifications.getExpoPushTokenAsync()).data;
	  } else {
		alert('Must use physical device for Push Notifications');
	  }

	  if (Platform.OS === 'android') {
		Notifications.setNotificationChannelAsync('begowork', {
		  name: 'begowork',
		  importance: Notifications.AndroidImportance.MAX,
		  vibrationPattern: [0, 250, 250, 250],
		  lightColor: '#FF231F7C',
		});
	  }

	  return token;
	}
  if (!isLoadingComplete) {
    return null;
  } else { 
		return (
			<React.Fragment>
				{(token||guest)?<AreaComp />:<SafeAreaProvider><StartedNavigator expoPushToken={expoPushToken} guestChanger={setGuest} tokenChanger={setToken}/><StatusBar /></SafeAreaProvider>}
				{!connected&&<Overlay>
					<Text>Vous devez avoir une connexion internet!</Text>
				</Overlay>}
			</React.Fragment>
		);
  }
}

const App2 =()=>{
  const[isLoaded,SetisLoaded]=useState(false)
 
 setTimeout( ()=>{SetisLoaded(true)},2000)
   return (
      <AnimatedSplash
        isLoaded={isLoaded}
        logoImage={require("./assets/images/logoS.jpg")}
        backgroundColor={"#fff"}
        logoHeight={200}
        logoWidth={200}
      >
        <App/>
      </AnimatedSplash>
    )
  
}

export default App2;
