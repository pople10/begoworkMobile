import React,{useState,useEffect,ReactDOM} from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity,Dimensions,Linking} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ImageBackground } from 'react-native';
import { Entypo ,FontAwesome5  } from '@expo/vector-icons';
import apiConst from '../constants/api';
import Swal from 'sweetalert2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from '../components/Spinner';
import CustomisableAlert ,{showAlert,closeAlert } from "react-native-customisable-alert";
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

export default function FirstScreen (props) {
	const [token,setToken]=useState(null);
	const colorScheme = useColorScheme();
	const openURL = (url) => {
	  Linking.openURL(url).catch((err) => console.error('An error occurred', err));
	}
	const goGuestMode = async ()=>
	{
		props.guestChanger(true);
		try {
			//await AsyncStorage.setItem("guest",true.toString());
		} catch(e) {
			
		}
	}
	useEffect(()=>{
		  
	  },[]);
	return (
		<ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center'}}>
			<View style={{backgroundColor:'black',height : '100%',width:'100%',position:'absolute',left:0,top:0}}>
				<ImageBackground source={require("../assets/images/backgroundFirstPage.jpg")} resizeMode="cover" style={styles.image}>	
					<Text style={styles.title}>Bienvenue</Text>
					<Image source={require("../assets/images/logoTransparent.png")} style={styles.logo} />
					<TouchableOpacity 
						onPress={() => props.navigation.navigate('Register')}
						style={{ backgroundColor: '#FB7600', width:'90%', marginRight:'auto', marginLeft:'auto', textAlign:'center', padding:10,marginTop:(dim.height/20),borderColor:"white",borderWidth:0.5 }}>
						<Text style={{ fontSize: (dim.width/20), color: '#fff',textAlign:'center' }}>Registre</Text>
					</TouchableOpacity>
					<TouchableOpacity 
						onPress={() => props.navigation.navigate('Login')}
						style={{ backgroundColor: 'transparent', width:'90%', marginRight:'auto', marginLeft:'auto', textAlign:'center', padding:10,marginTop:(dim.height/20),borderColor:"#FB7600",borderWidth:2 }}>
						<Text style={{ fontSize: (dim.width/20), color: '#fff',textAlign:'center' }}>Se connecter</Text>
					</TouchableOpacity>
					<Text style={{fontSize: (dim.height/50),color:"white", marginLeft:0, width:'90%',marginTop:(dim.height/100)}}
					onPress={() => props.navigation.navigate('Reset')}>
						Mot de passe oublié?
					</Text>
					<TouchableOpacity 
						onPress={() => goGuestMode()}
						style={{ backgroundColor: 'transparent', width:'90%', marginRight:'auto', marginLeft:'auto', textAlign:'center', padding:10,marginTop:(dim.height/9),borderColor:"#fff",borderWidth:2 }}>
						<Text style={{ fontSize: (dim.width/20), color: '#fff',textAlign:'center' }}>Continue comme visiteur</Text>
					</TouchableOpacity>
					<View style={{flexDirection:'row'}}>
						<FontAwesome5 name="facebook" size={(dim.height/15)} color="white" style={{marginTop:(dim.height/20),marginRight:(dim.width/7)}} 
						onPress={()=>openURL("fb://page/1767821910120070")}/>
						<Entypo name="twitter-with-circle" size={(dim.height/15)} color="white" style={{marginTop:(dim.height/20)}} 
						onPress={()=>openURL("http://www.twitter.com/")}/>
					</View>
				</ImageBackground>	
			</View>
		</ScrollView>
	);
}

const dim = Dimensions.get('screen');
const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent:'center'
	},
	title: {
		fontSize: (dim.width/7),
		fontWeight: 'bold',
		color:"white",
		fontStyle:'normal',
		fontWeight:'normal',
		marginLeft:'5%',
		marginBottom:20
	},
		separator: {
		marginVertical: 30,
		height: 1,
		width: '80%',
	},
	buttons:{ 
		backgroundColor: '#FB7600',
		width:'90%',
		marginRight:'auto',
		marginLeft:'auto',
		textAlign:'center',
		padding:10
	},
	image: {
		flex: 1,
		justifyContent: "center",
		alignItems: 'center'
	},
	logo: {
		width: (dim.width/3),
		height: (dim.width/3),
		resizeMode: 'contain'
	}
});