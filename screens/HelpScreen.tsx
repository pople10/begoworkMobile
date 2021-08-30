import React,{useEffect,useState,useRef} from 'react'
import {ImageBackground, StyleSheet,Dimensions,ActivityIndicator,TouchableOpacity,ScrollView} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View} from '../components/Themed';
import ButtonCustom from '../components/Button';
import Loader from '../components/customLoader';
import {getFirstname} from '../services/user';
import apiConst from '../constants/api';
import Spinner from '../components/Spinner';
import Input from '../components/Input';
import TextArea from '../components/TextArea';
import CustomisableAlert ,{showAlert,closeAlert } from "react-native-customisable-alert";

export default function HelpScreen (props) {
	const [sentData,setSentData] = useState(false);
	const [loaded,setLoaded]=useState(false);
	
	const [subject,setSubject]=useState(null);
	const [message,setMessage]=useState(null);
	const [firstname,setFirstname]=useState(null);
	const [lastname,setLastname]=useState(null);
	const [email,setEmail]=useState(null);
	
	useEffect(()=>{
		setLoaded(true);
	},[]);
	/*************** Methods *******************/
	const closeSession = async ()=>
	{
		props.tokenChanger(null);
		(async () => {try { await AsyncStorage.removeItem("token");console.log("deleted"); } catch(exception) { console.log("logged out"); }})();
	};
	const resetData = () =>
	{
		setSubject(null);
		setMessage(null);
		setEmail(null);
		setFirstname(null);
		setLastname(null);
	}
	const sendMessage = async ()=>
	{
		setSentData(true);
		const suffix = (props.guest?"public":"private");
		await fetch(apiConst.webURL+"/api/email/message/"+suffix,{
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'Accept':'application/json',
			  'Authorization': 'Bearer '+props.token
			},
			body: JSON.stringify({email:email,firstname:firstname,lastname:lastname,message:message,subject:subject})
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
					message: "Envoyé avec succès.\nVerifie la réception dans votre boite mail",
					alertType: 'success',
					btnLabel:"D'accord",
					leftBtnLabel:"Annuler",
					onPress:() => resetData()
				});
        });})
        .catch(function(error) {
          console.log("Error XHR : "+error);
        })
		.finally(()=>{setSentData(false);});
	};
	/*************** END Methods *******************/
	if(!loaded)
	  return <Loader/>;
	if(props.guest)
	return (
    <ScrollView contentContainerStyle={{ flexGrow: 1,alignItems: 'center',justifyContent: 'center',backgroundColor:'#fff',paddingTop:'5%'}}>
		<Text style={styles.title}>Contactez-nous</Text>
		<Input value={firstname} secured={false} type="name" placeholder="Prénom" action={setFirstname}/>
		<Input value={lastname} secured={false} type="familyName" placeholder="Nom" action={setLastname}/>
		<Input value={email} secured={false} type="emailAddress" placeholder="Email" action={setEmail}/>
		<Input value={subject} secured={false} type="none" placeholder="Sujet" action={setSubject}/>
		<TextArea value={message} secured={false} type="none" placeholder="Message" action={setMessage}/>
		<TouchableOpacity disabled={sentData}
			onPress={() => sendMessage()}
			style={[styles.buttons,{marginBottom:'5%'}]}>
			{!sentData&&<Text style={{ fontSize: 20, color: '#fff',textAlign:'center' }}>Envoyer</Text>}
			{sentData&&
			<Spinner/>
			}
		</TouchableOpacity>
		<CustomisableAlert titleStyle={{ fontSize: 18, fontWeight: "bold", }} btnLabelStyle={{ color: 'white', width:'100%', textAlign: 'center', backgroundColor:"#FB7600" }} />
    </ScrollView>
	);
	return (
    <ScrollView contentContainerStyle={{ flexGrow: 1,alignItems: 'center',justifyContent: 'center',backgroundColor:'#fff',paddingTop:'5%'}}>
		<Text style={styles.title}>Contactez-nous</Text>
		<Input value={subject} secured={false} type="none" placeholder="Sujet" action={setSubject}/>
		<TextArea value={message} secured={false} type="none" placeholder="Message" action={setMessage}/>
		<TouchableOpacity disabled={sentData}
			onPress={() => sendMessage()}
			style={[styles.buttons,{marginBottom:'5%'}]}>
			{!sentData&&<Text style={{ fontSize: 20, color: '#fff',textAlign:'center' }}>Envoyer</Text>}
			{sentData&&
			<Spinner/>
			}
		</TouchableOpacity>
		<CustomisableAlert titleStyle={{ fontSize: 18, fontWeight: "bold", }} btnLabelStyle={{ color: 'white', width:'100%', textAlign: 'center', backgroundColor:"#FB7600" }} />
    </ScrollView>
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
		marginBottom:15
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