import React,{useEffect,useState,useRef} from 'react'
import {ImageBackground, StyleSheet,Dimensions,ActivityIndicator,TouchableOpacity,ScrollView,RefreshControl} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View} from '../components/Themed';
import ButtonCustom from '../components/Button';
import Loader from '../components/customLoader';
import {getFirstname} from '../services/user';
import apiConst from '../constants/api';
import Spinner from '../components/Spinner';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import Separator from '../components/Separator';
import FlatListGrid from '../components/FlatListGrid';
import CustomisableAlert ,{showAlert,closeAlert } from "react-native-customisable-alert";
import NotAuth from '../screens/NotAuthScreenRoot';
import { AntDesign } from '@expo/vector-icons';
import { Table, Row, Rows } from 'react-native-table-component';

const wait = timeout => {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
};

export default function HelpScreen (props) {
	const [sentData,setSentData] = useState(false);
	const [loaded,setLoaded]=useState(false);
	const [flag,setFlag]=useState(false);
	
	const [orders,setOrders]=useState(null);
	const [order,setOrder]=useState(null);
	
	const [refreshing, setRefreshing] = useState(false);

	const onRefresh = React.useCallback(() => {
		setRefreshing(true);
		setFlag(!flag);
		wait(2000).then(() => setRefreshing(false));
	});

	useEffect(()=>{
		(async () => {await getOrders();})();
	},[flag]);
	
	useEffect(()=>{
		//console.log(order);
		if(order)
			getOrder(order.idOrder);
	},[flag]);
	/*************** Methods and variables *******************/
	const closeSession = async ()=>
	{
		props.tokenChanger(null);
		(async () => {try { await AsyncStorage.removeItem("token");console.log("deleted"); } catch(exception) { console.log("logged out"); }})();
	};
	const getOrders = async ()=>
	{
		await fetch(apiConst.webURL+"/api/order",{
			method: 'GET',
			headers: {
			  'Content-Type': 'application/json',
			  'Accept':'application/json',
			  'Authorization': 'Bearer '+props.token
			}
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
				setOrders(data);
        });})
        .catch(function(error) {
          console.log("Error XHR : "+error);
        })
		.finally(()=>{setLoaded(true);});
	};
	const getOrder = async (id)=>
	{
		setLoaded(false);
		await fetch(apiConst.webURL+"/api/order/"+id,{
			method: 'GET',
			headers: {
			  'Content-Type': 'application/json',
			  'Accept':'application/json',
			  'Authorization': 'Bearer '+props.token
			}
		  })
		.then(function(response) {
			let statu = response.status;
			let text = "Une erreur se produit";
			if(statu!=200)
			{
				setOrder(null);
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
				setOrder(data);
        });})
        .catch(function(error) {
          console.log("Error XHR : "+error);
        })
		.finally(()=>{setLoaded(true);});
	};
	const getDataForTable = (data)=>
	{
		let datos = [];
		let total = 0;
		data.forEach((d)=>{
			datos.push([d.title,d.seatsNumber.toString(),d.price.toString()]);
			total+=d.price;
		});
		let res = {elems:datos,total:[["","Total",total.toString()]]};
		return res;
	};
	const header = ["Element","Places","Prix"];
	/*************** END Methods and variables *******************/
	if(props.guest)
		return <NotAuth guestChanger={props.guestChanger} text="Commandes"/>;
	if(!loaded)
	  return <Loader/>;
	if(order)
		return (
		<ScrollView contentContainerStyle={{ flexGrow: 1,paddingHorizontal:10,backgroundColor:'#fff',paddingTop:10}}
		refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
			<View style={{flexDirection: 'row'}}>
				<AntDesign name="back" size={30} onPress={()=>{setOrder(null);setFlag(!flag);setLoaded(false);}}color="black" style={{paddingHorizontal:5}}/>
				<Text style={[styles.statu,{borderColor:order.statuDetail.bgColor}]}>{order.statuDetail.labelFr}</Text>
				<Text style={{fontSize: 23, fontWeight: 'bold'}}> Réservation - {order.idOrder}</Text>
			</View>
			<Text style={{fontSize: 15,marginTop:30}}> Temps du création: {(new Date(order.created_at)).toLocaleString()}</Text>
			<Text style={{fontSize: 15,marginTop:10}}> Temps du modification: {(new Date(order.updated_at)).toLocaleString()}</Text>
			<Separator />
			<Text style={{fontSize: 15,marginTop:10}}> Début du réservation: {order.startTime}</Text>
			<Text style={{fontSize: 15,marginTop:10}}> Fin du réservation: {order.endTime}</Text>
			<Separator />
			<Table >
			  <Row flexArr={[3, 1, 1]} data={header} style={{ height: 40, backgroundColor: '#f1f8ff' }} textStyle={{ margin: 6 }}/>
			  <Rows flexArr={[3, 1, 1]} data={getDataForTable(order.product).elems} textStyle={{ margin: 6 }}/>
			  <View style={{height:0.3,marginVertical:10,backgroundColor:"#000"}}/>
			  <Rows flexArr={[3, 1, 1]} data={getDataForTable(order.product).total} textStyle={{ margin: 6 }}/>
			</Table>
			<CustomisableAlert titleStyle={{ fontSize: 18, fontWeight: "bold", }} btnLabelStyle={{ color: 'white', width:'100%', textAlign: 'center', backgroundColor:"#FB7600" }} />
		</ScrollView>
		);
	if(orders&&orders.length===0)
		return (
			<View style={styles.container}>
				<ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'
					refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
					<Text style={{fontSize: 20, fontWeight: 'bold'}}>Il n'y pas de commandes encore.</Text>
					<Text style={styles.link}>Swipe Down pour actualiser.</Text>
					<TouchableOpacity onPress={() => props.navigation.navigate('Search')} style={styles.link}>
						<Text style={styles.linkText}>Reserver une commande maintenant!</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>
		);
	return (
	<View style={styles.containerOrders}>
		<ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps='handled'
		refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
			<View style={styles.tasksWrapper}>
				<View style={styles.items}>
					{orders.map(data =>{
						return <FlatListGrid orderID={data.idOrder} action={getOrder} squareColor={data.statuDetail.bgColor} key={data.idOrder} text={"Réservation "+data.idOrder+"\n"+(new Date(data.updated_at)).toLocaleString()} />;
					})}
				</View>
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