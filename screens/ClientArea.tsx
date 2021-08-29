import  React,{useEffect} from 'react';
import { ColorSchemeName } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Navigation from '../navigation';

export default function ClientArea({ colorScheme,...props}: { colorScheme: ColorSchemeName }) {
  return (
    <SafeAreaProvider>
		<Navigation expoPushToken={props.expoPushToken} tokenChanger={props.tokenChanger} guestChanger={props.guestChanger} guest={props.guest} token={props.token} colorScheme={colorScheme} />
		<StatusBar />
	</SafeAreaProvider>
  );
}