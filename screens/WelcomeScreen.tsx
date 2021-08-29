import React,{useEffect,useState,useRef} from 'react'
import {ImageBackground, StyleSheet,Dimensions,ActivityIndicator} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View,ScrollView } from '../components/Themed';
import ButtonCustom from '../components/Button';
import Loader from '../components/customLoader';
import {getFirstname} from '../services/user';

export default function WelcomePage (props) {
	const [firstname,setFirstname] = useState(null);
	const [token,setToken] = useState(null);
	const [loaded,setLoaded]=useState(false);
	useEffect(()=>{
		if(props.guest)
			setLoaded(true);
		if(!props.guest)
			(async () => {
				let data = await getFirstname(props.token);
				if(data===false)
				{
					props.tokenChanger(null);
					(async () => {try { await AsyncStorage.removeItem("token");console.log("deleted"); } catch(exception) { console.log("logged out"); }})();
				}
				setFirstname(data);
				 setLoaded(true);
			})();
	});
	if(!loaded)
	  return <Loader/>;
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bonjour {props.guest?"visiteur":firstname}!</Text>
	  <ButtonCustom action={()=>props.navigation.navigate("Search")} weight='normal' color="white" bgColor="#FB7600" borColor="white" borWidth={0} text="Découvrir"/>
      <View style={[styles.separator,{marginTop:(dim.height/20)}]} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
	  <View style={styles.bottomContainer}>
	  <ImageBackground style={styles.photo} source={require("../assets/images/welcomeImage.png")}>
		<View style={{flex: 1,flexDirection: "column",padding:4,background:'#fff',width:'60%',opacity:1,}}>
			<Text style={{flex:2,color:'black',fontSize: 25, fontWeight: "bold"}}>Réservations à venir</Text>
			<Text style={{flex:1,color:'grey',fontSize: 10}}>Meilleurs Working Spaces</Text>
			<View style={{flex:1}}></View>
			<ButtonCustom weight='bold' style={{flex:2,justifyContent:'center',alignItems: 'center'}} action={()=>props.navigation.navigate("Search")} color="#000" bgColor="#fff" borColor="black" borWidth={2} text="Reserver"/>
			<View style={{flex:1}}></View>
		</View>
		</ImageBackground>
	  </View>
    </View>
  );
}
const dim = Dimensions.get("screen");

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop:12
	},
	title: {
		fontSize: (dim.width/12),
		width:"90%",
		marginLeft:"auto",
		marginRight:"auto",
		fontWeight: 'bold',
		marginBottom:(dim.height/15)
	},
	separator: {
		marginVertical: 20,
		height: 1.5,
		width: '100%',
	},
	photo: {
		 width:"100%",
                 height:'100%',
                flex:1 
	},
	bottomContainer:{
		 flex:1,
		width:'90%',
		marginLeft:'auto',
		marginRight:'auto',
		flexDirection: "row",
		height:(dim.height/3.5),
		marginTop:(dim.height/15),
		marginBottom:(dim.height/15),
		borderWidth:1	,
		justifyContent: "flex-end",
		alignItems: "flex-end",
	},

})