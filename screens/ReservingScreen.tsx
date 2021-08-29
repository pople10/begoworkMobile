import React,{useEffect,useState,useRef} from 'react'
import {ImageBackground, StyleSheet,Dimensions,ActivityIndicator,TouchableOpacity,ScrollView,RefreshControl,Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View} from '../components/Themed';
import apiConst from '../constants/api';
import CustomisableAlert ,{showAlert,closeAlert } from "react-native-customisable-alert";
import { Entypo,MaterialCommunityIcons,Feather,AntDesign } from '@expo/vector-icons';
import ListingCard from '../components/ListingCard';
import Loader from '../components/customLoader';
import Separator from '../components/Separator';
import RadioGroup,{Radio} from "react-native-radio-input";
import PickerTime from '../components/PickerTime';
import Spinner from '../components/Spinner';
import { Table, Row, Rows } from 'react-native-table-component';

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

export default function ReservingScreen (props) {
	const [sentData,setSentData] = useState(false);
	const [loaded,setLoaded]=useState(false);
	
	const [listing,setListing]=useState(false);
	
	const [selected,setSelected]=useState(false);
	
	const [startDate,setStartDate]=useState(null);
	const [endDate,setEndDate]=useState(null);
	
	useEffect(()=>{
		(async () => {getListing();})();
	},[]);
	
	/*************** Methods and variables *******************/
	const closeSession = async ()=>
	{
		props.tokenChanger(null);
		(async () => {try { await AsyncStorage.removeItem("token"); } catch(exception) {  }})();
	};
	const getListing = async ()=>
	{
		setLoaded(false);
		await fetch(apiConst.webURL+"/api/listing/"+props.idListing,{
			method: 'GET',
			headers: {
			  'Content-Type': 'application/json',
			  'Accept':'application/json'
			}
		  })
		.then(function(response) {
			let statu = response.status;
			let text = "Une erreur se produit";
			if(statu!=200)
			{
				props.goBack();
				setSelected(null);
				if(statu==422)
				{
					response.json().then(data => {
						text = data.erreur;
						showAlert({
						  title:"Erreur",
						  message: text,
						  alertType: 'error',
						  btnLabel:"D'accord",
						  leftBtnLabel:"Annuler",
						  onPress:() => closeAlert()
						});
						return;
					});
				}
				if(statu==411 || statu==401)
				{
					text = "Vous êtes non-authenifié, veuillez se connecter";
					showAlert({
						title:"Erreur",
						message: text,
						alertType: 'error',
						btnLabel:"D'accord",
						leftBtnLabel:"Annuler",
						onPress:() => {(async () => {await closeSession();})();}
					});
					return;
				}
				showAlert({
					title:"Erreur",
					message: text,
					alertType: 'error',
					btnLabel:"D'accord",
					leftBtnLabel:"Annuler",
					onPress:() => closeAlert()
				});
				return;
			}
			return response.json().then(function(data) {
				setListing(data);
        });})
        .catch(function(error) {
          console.log("Error XHR : "+error);
        })
		.finally(()=>{setLoaded(true);});
	};
	const reserve = async ()=>
	{
		setSentData(true);
		let datosSelec="";
		if(selected)
			datosSelec=selected;
		await fetch(apiConst.webURL+"/api/order/reserve",{
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'Accept':'application/json',
			  'Authorization': 'Bearer '+props.token
			},
			body: JSON.stringify({products:datosSelec.toString(),startTime:startDate,endTime:endDate})
		  })
		.then(function(response) {
			let statu = response.status;
			let text = "Une erreur se produit";
			if(statu!=200)
			{
				if(statu==422)
				{
					response.json().then(data => {
						text = data.erreur;
						showAlert({
						  title:"Erreur",
						  message: text,
						  alertType: 'error',
						  btnLabel:"D'accord",
						  leftBtnLabel:"Annuler",
						  onPress:() => closeAlert()
						});
						return;
					});
				}
				if(statu==411 || statu==401)
				{
					text = "Vous êtes non-authenifié, veuillez se connecter";
					showAlert({
						title:"Erreur",
						message: text,
						alertType: 'error',
						btnLabel:"D'accord",
						leftBtnLabel:"Annuler",
						onPress:() => {(async () => {await closeSession();})();}
					});
					return;
				}
				showAlert({
					title:"Erreur",
					message: text,
					alertType: 'error',
					btnLabel:"D'accord",
					leftBtnLabel:"Annuler",
					onPress:() => closeAlert()
				});
				return;
			}
			return response.json().then(function(data) {
				showAlert({
					title:"Succès",
					message: data.done,
					alertType: 'success',
					btnLabel:"D'accord",
					leftBtnLabel:"Annuler",
					onPress:() => done()
				});
        });})
        .catch(function(error) {
          console.log("Error XHR : "+error);
        })
		.finally(()=>{setSentData(false);});
	};
	const done = ()=>
	{
		setSelected(null);
		setStartDate(null);
		setEndDate(null);
		props.goBack(null);
		props.resultChanger(null);
		props.typeChanger(null);
		props.reset();
		props.navigation.navigate("Orders");
	};
	const getDataForTable = (time)=>
	{
		let array = [];
		time.forEach(d=>{
			array.push([d.day,d.startTime,d.endTime]);
		});
		return array;
	}
	const header = ["Jour","Début","Arrêt"];
	const ReservingButton = () => {
		return (
			<TouchableOpacity disabled={sentData}
				onPress={() => reserve()}
				style={[styles.buttons,{marginBottom:'5%'}]}>
					{!sentData&&<Text style={{ fontSize: 20, color: '#fff',textAlign:'center' }}>Réserver</Text>}
					{sentData&&
					<Spinner/>
					}
			</TouchableOpacity>
		);
	}
	const AuthButton = () => {
		return (
			<TouchableOpacity 
				onPress={() => props.guestChanger(false)}
				style={[styles.buttons,{marginBottom:'5%'}]}>
					<Text style={{ fontSize: 20, color: '#fff',textAlign:'center' }}>S'authentifier</Text>
			</TouchableOpacity>
		);
	}
	/*************** END Methods and variables *******************/
	if(!loaded)
	  return <Loader/>;
	return (
	<View style={styles.containerOrders}>
		<View style={{flexDirection: 'row',paddingTop:10}}>
			<AntDesign name="back" size={30} onPress={()=>{props.goBack();setSelected(null);}}color="black" style={{paddingHorizontal:5}}/>
			<Text style={{fontSize: 23, fontWeight: 'bold'}}> {listing.type.label}</Text>
		</View>
		<ScrollView contentContainerStyle={{ flexGrow: 1,backgroundColor:"#fff",padding:3,width:'100%'}}>
			<Image style={{width:(dim.width),height:(dim.height/5)}} source={{uri:listing.photoUrl}}/>
			<Text style={styles.title}>{listing.title}</Text>
			<Text style={[styles.linkText,{marginLeft:"auto",marginRight:"auto"}]}>{listing.location.address+", "+listing.location.city+" "+listing.location.zipcode}</Text>
			<Separator/>
			<Text style={{alignItems:"center",width:'95%',textAlign:'justify',marginLeft:"auto",marginRight:"auto"}}>
				{listing.description}
			</Text>
			<Separator/>
			<Table style={{marginLeft:"auto",marginRight:"auto",width:'95%'}}>
				<Text>Disponibilité :</Text>
				<Row data={header} style={{ height: 40, backgroundColor: '#f1f8ff' }} textStyle={{ margin: 6 }}/>
				<Rows data={getDataForTable(listing.time)} textStyle={{ margin: 6 }}/>
			</Table>
			<Separator/>
			<RadioGroup  labelStyle={{fontSize:15}} RadioStyle={{paddingHorizontal:20,paddingVertical:5}} getChecked={setSelected}>
				{listing.product&&listing.product.map((data,index)=>{
					return <Radio key={index} iconName={"check"} label={data.title+" ("+data.seatsNumber+" place"+(data.seatsNumber>1?"s":"")+")"+"\nPrix : "+data.price+" "+data.currency} value={data.idProd}/>
				})}
			</RadioGroup>
			<View style={{flexDirection: 'row',paddingTop:10}}>
				<PickerTime width="50%" placeholder="Date du début" value={startDate} action={setStartDate}/>
				<PickerTime width="50%" placeholder="Date du fin" value={endDate} action={setEndDate}/>
			</View>
			{props.guest?<AuthButton/>:<ReservingButton/>}
		</ScrollView>
		<CustomisableAlert
			titleStyle={{
				fontSize: 18,
				fontWeight: "bold",
									
			}}
			btnLabelStyle={{
				color: 'white',
				width:'100%',
				textAlign: 'center',
				backgroundColor:"#FB7600"
			}}
		/>
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
		fontSize: 16,
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