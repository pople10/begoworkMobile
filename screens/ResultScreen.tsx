import React,{useEffect,useState,useRef} from 'react'
import {ImageBackground, StyleSheet,Dimensions,ActivityIndicator,TouchableOpacity,ScrollView,RefreshControl} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View} from '../components/Themed';
import apiConst from '../constants/api';
import CustomisableAlert ,{showAlert,closeAlert } from "react-native-customisable-alert";
import { Entypo,MaterialCommunityIcons,Feather,AntDesign } from '@expo/vector-icons';
import ListingCard from '../components/ListingCard';

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

export default function ResultScreen (props) {
	/*************** Methods and variables *******************/
	const closeSession = async ()=>
	{
		props.tokenChanger(null);
		(async () => {try { await AsyncStorage.removeItem("token"); } catch(exception) {  }})();
	};
	/*************** END Methods and variables *******************/
	if(props.data.length===0)
		return (
			<View style={styles.containerOrders}>
				<View style={{flexDirection: 'row',paddingTop:10}}>
					<AntDesign name="back" size={30} onPress={()=>{props.goBack(null);}}color="black" style={{paddingHorizontal:5}}/>
					<Text style={{fontSize: 23, fontWeight: 'bold'}}> Résultat</Text>
				</View>
				<ScrollView contentContainerStyle={{ flexGrow: 1,backgroundColor:"#fff",padding:20,justifyContent:"center",alignItems:"center"}} keyboardShouldPersistTaps='handled'>
					<Text style={{fontWeight:'bold',fontSize:20}}>Aucune résultat!</Text>
				</ScrollView>
			</View>
		);
	return (
	<View style={styles.containerOrders}>
		<View style={{flexDirection: 'row',paddingTop:10}}>
			<AntDesign name="back" size={30} onPress={()=>{props.goBack(null);}}color="black" style={{paddingHorizontal:5}}/>
			<Text style={{fontSize: 23, fontWeight: 'bold'}}> Résultat</Text>
		</View>
		<ScrollView contentContainerStyle={{ flexGrow: 1,backgroundColor:"#fff",padding:3,justifyContent:"center",alignItems:"center",width:'100%'}}>
			{props.data&&props.data.map((data,index)=>{
				return <ListingCard key={index} title={data.title} 
					address={data.location.address+", "+data.location.city}
					imageURL={data.photoUrl} low={data.lowPrice.price+" "+data.lowPrice.currency}
					reserve={props.reserve} idListing={data.idListing}/>;
			})}
		</ScrollView>
	</View>
	);
}
const dim = Dimensions.get("screen");

const styles = StyleSheet.create({
	statu:{
		padding:4,
		borderWidth:1.5
	},
	items: {
		marginTop: 30,
		paddingHorizontal:'3%'
	},
		writeTaskWrapper: {
		position: 'absolute',
		bottom: 60,
		width: '100%',
		flexDirection: 'row',
		justifyContent: 'space-around',
		alignItems: 'center'
	},
	containerOrders: {
		flex: 1,
		backgroundColor: '#E8EAED',
	},
	linkText: {
		fontSize: 14,
		color: '#2e78b7',
		marginTop:20
	},
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		paddingTop:12
	},
	title: {
		fontSize: 20,
		width:"95%",
		marginLeft:"auto",
		marginRight:"auto",
		fontWeight: 'bold'
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
	buttons:{ 
		backgroundColor: '#FB7600',
		width:'90%',
		marginRight:'auto',
		marginLeft:'auto',
		textAlign:'center',
		padding:10
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