import React,{useEffect,useState,useRef} from 'react'
import {ImageBackground, StyleSheet,Dimensions,ActivityIndicator,TouchableOpacity,ScrollView,RefreshControl} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View} from '../components/Themed';
import ButtonCustom from '../components/Button';
import Loader from '../components/customLoader';
import {getFirstname} from '../services/user';
import Spinner from '../components/Spinner';
import Separator from '../components/Separator';
import PickerTime from '../components/PickerTime';
import apiConst from '../constants/api';
import CustomisableAlert ,{showAlert,closeAlert } from "react-native-customisable-alert";
import NotAuth from '../screens/NotAuthScreenRoot';
import { Entypo,MaterialCommunityIcons,Feather,AntDesign,MaterialIcons } from '@expo/vector-icons';
import {Picker} from '@react-native-picker/picker';
import { Input } from 'react-native-elements';

import ResultScreen from './ResultScreen';
import ReservingScreen from './ReservingScreen';

export default function SearchScreen (props) {
	const [sentData,setSentData] = useState(false);
	const [loaded,setLoaded]=useState(false);
	const [flag,setFlag]=useState(false);
	
	const [type,setType]=useState(null);
	
	/* Address States */
	const [address,setAddress]=useState(null);
	const [addresses,setAddresses]=useState(null);
	/* End Address States */
	
	/* Keyword States */
	const [keyword,setKeyword]=useState(null);
	/* End Keyword States */
	
	/* Type States */
	const [listingType,setListingType]=useState(null);
	const [listingTypes,setListingTypes]=useState(null);
	/* End Type States */
	
	/* Availibility States */
	const [places,setPlaces]=useState(null);
	const [startDate,setStartDate]=useState(null);
	const [endDate,setEndDate]=useState(null);
	/* End Availibility States */
	
	const [result,setResult]=useState(null);
	
	const [reserving,setReserving]=useState(null);
	
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		setFlag(!flag);
		wait(2000).then(() => setRefreshing(false));
	});

	useEffect(()=>{
		setLoaded(true);
	},[]);
	
	useEffect(()=>{
		if(type==="address")
		{
			(async () => {getCities();})();
		}
		if(type==="type")
		{
			(async () => {getTypes();})();
		}
		if(type==="availibility")
		{
			(async () => {getTypes();})();
		}
	},[type]);
	
	useEffect(()=>{
		if(places)
		{
			let str = places.slice(-1);
			if(isNaN(str) || str===" ")
				setPlaces(places.replace(str,""));
		}
	},[places]);
	/*************** Methods and variables *******************/
	const reset = ()=>
	{
		setType(null);
		setAddress(null);
		setAddresses(null);
		setKeyword(null);
		setListingType(null);
		setListingTypes(null);
		setPlaces(null);
		setStartDate(null);
		setEndDate(null);
	}
	const closeSession = async ()=>
	{
		props.tokenChanger(null);
		(async () => {try { await AsyncStorage.removeItem("token"); } catch(exception) {  }})();
	};
	const getCities = async ()=>
	{
		setLoaded(false);
		await fetch(apiConst.webURL+"/api/location/cities",{
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
				setType(null);
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
				setAddresses(data);
        });})
        .catch(function(error) {
          console.log("Error XHR : "+error);
        })
		.finally(()=>{setLoaded(true);});
	};
	const getTypes = async ()=>
	{
		setLoaded(false);
		await fetch(apiConst.webURL+"/api/listing/type",{
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
				setType(null);
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
				setListingTypes(data);
        });})
        .catch(function(error) {
          console.log("Error XHR : "+error);
        })
		.finally(()=>{setLoaded(true);});
	};
	const getResult = async ()=>
	{
		if(!type)
			return;
		let prefex="";
		let data="?";
		if(type==="availibility")
		{
			data="?idType=";
			prefex+="available";
			if(listingType)
				data+=listingType;
			if(keyword)
				data+="&keyword="+keyword;
			if(places)
				data+="&places="+places;
			if(startDate)
				data+="&startTime="+startDate;
			if(endDate)
				data+="&endTime="+endDate;
		}
		if(type==="type")
		{
			if(listingType)
				data+="idType="+listingType;
			prefex+="type";
		}
		if(type==="address")
		{
			let arr = address.split("-");
			if(address)
				data+="country="+arr[1]+"&city="+arr[0];
			prefex+="countryandcity";
		}
		if(type==="keyword")
		{
			if(keyword)
				data+="keyword="+keyword;
			prefex+="keyword";
		}
		setSentData(true);
		await fetch(apiConst.webURL+"/api/listing/search/"+prefex+data,{
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
				setResult(null);
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
				setResult(data);
        });})
        .catch(function(error) {
          console.log("Error XHR : "+error);
        })
		.finally(()=>{setSentData(false);});
	};
	const goBackReserve = ()=>
	{
		setReserving(null);
	}
	const allData = async () =>
	{
		setLoaded(false);
		await fetch(apiConst.webURL+"/api/listing",{
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
				setResult(null);
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
				setResult(data);
        });})
        .catch(function(error) {
          console.log("Error XHR : "+error);
        })
		.finally(()=>{setLoaded(true);});
	};
	/*************** END Methods and variables *******************/
	if(!loaded)
	  return <Loader/>;
	if(reserving)
		return <ReservingScreen token={props.token} goBack={goBackReserve} 
				idListing={reserving} resultChanger={setResult} typeChanger={setType} 
				navigation={props.navigation} reset={reset} guest={props.guest}
				guestChanger={props.guestChanger}/>;
	/****Middleware Result****/
	if(result)
		return (
			<ResultScreen reserve={setReserving} goBack={setResult} data={result}/>
		);
	/****Middleware Types****/
	if(type==="availibility")
		return (
		<View style={styles.containerOrders}>
			<View style={{flexDirection: 'row',paddingTop:10}}>
				<AntDesign name="back" size={30} onPress={()=>{reset();}}color="black" style={{paddingHorizontal:5}}/>
				<Text style={{fontSize: 23, fontWeight: 'bold'}}> Recherche</Text>
			</View>
			<ScrollView contentContainerStyle={{ flexGrow: 1,backgroundColor:"#fff",padding:20,justifyContent:"center",alignItems:"center"}} keyboardShouldPersistTaps='handled'>
				<Input placeholder="Mot clé" value={keyword} 
					rightIcon={<Feather name="search" size={24} color="black" />}  
					onChangeText={value => setKeyword(value)} />
				<Separator/>
				<View style={{borderWidth:1,width:'95%',marginRight:'auto',borderColor:'black',marginLeft:'auto',marginBottom:20}}>
					<Picker
						style={{height:40,fontSize:15,alignItems:'center'}}
						selectedValue={listingType}
						onValueChange={(itemValue, itemIndex) =>
						setListingType(itemValue)}>
						{listingTypes&&listingTypes.map((data,index) =>
							{
								return <Picker.Item key={index} label={data.label} value={data.idListingType} />;
							}
						)}
					</Picker>
				</View>
				<Input placeholder="Nombre des places" value={places} 
					rightIcon={<MaterialCommunityIcons name="seat-recline-extra" size={24} color="black" />}  
					onChangeText={value => setPlaces(value)} keyboardType='numeric'/>
				<PickerTime placeholder="Date du début" value={startDate} action={setStartDate}/>
				<PickerTime placeholder="Date du fin" value={endDate} action={setEndDate}/>
				<TouchableOpacity disabled={sentData}
				onPress={() => getResult()}
				style={[styles.buttons,{marginBottom:'5%'}]}>
					{!sentData&&<Text style={{ fontSize: 20, color: '#fff',textAlign:'center' }}>Rechercher</Text>}
					{sentData&&
					<Spinner/>
					}
				</TouchableOpacity>
			</ScrollView>
		<CustomisableAlert titleStyle={{ fontSize: 18, fontWeight: "bold", }} btnLabelStyle={{ color: 'white', width:'100%', textAlign: 'center', backgroundColor:"#FB7600" }} />
		</View>
		);
	if(type==="type")
		return (
		<View style={styles.containerOrders}>
			<View style={{flexDirection: 'row',paddingTop:10}}>
				<AntDesign name="back" size={30} onPress={()=>{reset();}}color="black" style={{paddingHorizontal:5}}/>
				<Text style={{fontSize: 23, fontWeight: 'bold'}}> Recherche</Text>
			</View>
			<ScrollView contentContainerStyle={{ flexGrow: 1,backgroundColor:"#fff",padding:20,justifyContent:"center",alignItems:"center"}} keyboardShouldPersistTaps='handled'>
				<View style={{borderWidth:1,width:'90%',marginRight:'auto',borderColor:'black',marginLeft:'auto',marginBottom:20}}>
					<Picker
						style={{height:40,fontSize:15,alignItems:'center'}}
						selectedValue={listingType}
						onValueChange={(itemValue, itemIndex) =>
						setListingType(itemValue)}>
						{listingTypes&&listingTypes.map((data,index) =>
							{
								return <Picker.Item key={index} label={data.label} value={data.idListingType} />;
							}
						)}
					</Picker>
				</View>
				<TouchableOpacity disabled={sentData}
				onPress={() => getResult()}
				style={[styles.buttons,{marginBottom:'5%'}]}>
					{!sentData&&<Text style={{ fontSize: 20, color: '#fff',textAlign:'center' }}>Rechercher</Text>}
					{sentData&&
					<Spinner/>
					}
				</TouchableOpacity>
			</ScrollView>
		<CustomisableAlert titleStyle={{ fontSize: 18, fontWeight: "bold", }} btnLabelStyle={{ color: 'white', width:'100%', textAlign: 'center', backgroundColor:"#FB7600" }} />
		</View>
		);
	if(type==="keyword")
		return (
		<View style={styles.containerOrders}>
			<View style={{flexDirection: 'row',paddingTop:10}}>
				<AntDesign name="back" size={30} onPress={()=>{reset();}}color="black" style={{paddingHorizontal:5}}/>
				<Text style={{fontSize: 23, fontWeight: 'bold'}}> Recherche</Text>
			</View>
			<ScrollView contentContainerStyle={{ flexGrow: 1,backgroundColor:"#fff",padding:20,justifyContent:"center",alignItems:"center"}} keyboardShouldPersistTaps='handled'>
				<Input placeholder="Mot clé" value={keyword} 
					leftIcon={<Feather name="search" size={24} color="black" />}  
					onChangeText={value => setKeyword(value)} />
				<TouchableOpacity disabled={sentData}
				onPress={() => getResult()}
				style={[styles.buttons,{marginBottom:'5%'}]}>
					{!sentData&&<Text style={{ fontSize: 20, color: '#fff',textAlign:'center' }}>Rechercher</Text>}
					{sentData&&
					<Spinner/>
					}
				</TouchableOpacity>
			</ScrollView>
		<CustomisableAlert titleStyle={{ fontSize: 18, fontWeight: "bold", }} btnLabelStyle={{ color: 'white', width:'100%', textAlign: 'center', backgroundColor:"#FB7600" }} />
		</View>
		);
	if(type==="address")
		return (
		<View style={styles.containerOrders}>
			<View style={{flexDirection: 'row',paddingTop:10}}>
				<AntDesign name="back" size={30} onPress={()=>{reset();}}color="black" style={{paddingHorizontal:5}}/>
				<Text style={{fontSize: 23, fontWeight: 'bold'}}> Recherche</Text>
			</View>
			<ScrollView contentContainerStyle={{ flexGrow: 1,backgroundColor:"#fff",padding:20,justifyContent:"center",alignItems:"center"}} keyboardShouldPersistTaps='handled'>
				<View style={{borderWidth:1,width:'90%',marginRight:'auto',borderColor:'black',marginLeft:'auto',marginBottom:20}}>
					<Picker
						style={{height:40,fontSize:15,alignItems:'center'}}
						selectedValue={address}
						onValueChange={(itemValue, itemIndex) =>
						setAddress(itemValue)}>
						{addresses&&addresses.map((data,index) =>
							{
								return <Picker.Item key={index} label={data.city+" - "+data.country}value={data.city+"-"+data.country} />;
							}
						)}
					</Picker>
				</View>
				<TouchableOpacity disabled={sentData}
				onPress={() => getResult()}
				style={[styles.buttons,{marginBottom:'5%'}]}>
					{!sentData&&<Text style={{ fontSize: 20, color: '#fff',textAlign:'center' }}>Rechercher</Text>}
					{sentData&&
					<Spinner/>
					}
				</TouchableOpacity>
			</ScrollView>
		<CustomisableAlert titleStyle={{ fontSize: 18, fontWeight: "bold", }} btnLabelStyle={{ color: 'white', width:'100%', textAlign: 'center', backgroundColor:"#FB7600" }} />
		</View>
		);
	return (
	<View style={styles.containerOrders}>
		<ScrollView contentContainerStyle={{ flexGrow: 1,backgroundColor:"#fff",padding:20,justifyContent:"center",alignItems:"center"}} keyboardShouldPersistTaps='handled'>
			<Text style={styles.title}>Choisir la méthode du recherche</Text>
			<View key="container1" style={{flexDirection: 'row',justifyContent:'space-evenly',margin:5}}>
				<TouchableOpacity onPress={()=>{setType("address");}} style={{justiftyContent:"center", alignItems:"center",margin:5,backgroundColor:"#FB7600",width:(dim.width/2.5),height:(dim.width/2.5),padding:10}}>
					<Entypo name="address" size={40} color="white"/>
					<Text style={{color:"#fff",fontWeight: 'bold',fontSize:16}}>Recherche par adresse</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={()=>{setType("type");}} style={{justiftyContent:"center", alignItems:"center",margin:5,backgroundColor:"#FB7600",width:(dim.width/2.5),height:(dim.width/2.5),padding:10}}>
					<MaterialCommunityIcons name="format-list-bulleted-type" size={40} color="white"/>
					<Text style={{color:"#fff",fontWeight: 'bold',fontSize:16}}>Recherche par types</Text>
				</TouchableOpacity>
			</View>
			<View key="container2" style={{flexDirection: 'row',justifyContent:'space-evenly',margin:5}}>
				<TouchableOpacity onPress={()=>{setType("keyword");}} style={{justiftyContent:"center", alignItems:"center",margin:5,backgroundColor:"#FB7600",width:(dim.width/2.5),height:(dim.width/2.5),padding:10}}>
					<Feather name="key" size={40} color="white"/>
					<Text style={{color:"#fff",fontWeight: 'bold',fontSize:16}}>Recherche par mot clé</Text>
				</TouchableOpacity>
				<TouchableOpacity onPress={()=>{setType("availibility");}} style={{justiftyContent:"center", alignItems:"center",margin:5,backgroundColor:"#FB7600",width:(dim.width/2.5),height:(dim.width/2.5),padding:10}}>
					<MaterialIcons name="event-available"  size={40} color="white" />
					<Text style={{color:"#fff",fontWeight: 'bold',fontSize:16}}>Recherche par disponibilité</Text>
				</TouchableOpacity>
			</View>
			<View key="container3" style={{flexDirection: 'row',justifyContent:'space-evenly',margin:5}}>
				<TouchableOpacity onPress={()=>{allData();}} style={{justiftyContent:"center", alignItems:"center",margin:5,backgroundColor:"#FB7600",width:(dim.width/2.5),height:(dim.width/2.5),padding:10}}>
					<MaterialCommunityIcons name="seat" size={40} color="white"/>
					<Text style={{color:"#fff",fontWeight: 'bold',fontSize:16}}>Toutes les résultats</Text>
				</TouchableOpacity>
			</View>
		</ScrollView>
		<CustomisableAlert titleStyle={{ fontSize: 18, fontWeight: "bold", }} btnLabelStyle={{ color: 'white', width:'100%', textAlign: 'center', backgroundColor:"#FB7600" }} />
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