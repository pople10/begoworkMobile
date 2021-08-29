import React,{useState,useEffect,ReactDOM} from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TextInput,Easing,Animated,CheckBox,Linking } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import apiConst from '../constants/api';
import Swal from 'sweetalert2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from '../components/Spinner';
import CustomisableAlert ,{showAlert,closeAlert } from "react-native-customisable-alert";
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';
import {Picker} from '@react-native-picker/picker';

export default function Reset (props) {
	const [username,setUsername]=useState(null);
	const [password,setPassword]=useState(null);
	const [rePassword,setRePassword]=useState(null);
	const [code,setCode]=useState(null);
	const [usernameStored,setUsernameStored]=useState(null);
	const [attemps,setAttemps]=useState(0);
	
	const [sentData,setSentData]=useState(false);
	const [token,setToken]=useState(null);
	
	const [focused1,setFocused1]=useState(false);
	const [focused2,setFocused2]=useState(false);
	const [focused3,setFocused3]=useState(false);
	const [focused4,setFocused4]=useState(false);
	
	const colorScheme = useColorScheme();
	
	const openURL = (url) => {
	  Linking.openURL(url).catch((err) => console.error('An error occurred', err));
	}
	
	const clearProcess = async ()=>{
		setUsernameStored(null);
		setAttemps(0);
		try {
			await AsyncStorage.removeItem('usernameToSend');
		} catch (error) {  
		}
	};
	useEffect(()=>{
		const remindProcess = async ()=>{
			try {
				let value = await AsyncStorage.getItem('usernameToSend');
				setUsernameStored(value);
			} catch (error) {
					  
			}
		};
		remindProcess();
	  });
	  
	const sendRequest = async ()=>
	{
		setSentData(true);
		let tmpUser = username;
		await fetch(apiConst.webURL+"/api/account/reset",{
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'Accept':'application/json'
			},
			body: JSON.stringify({username:username})
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
				if(statu==411)
				{
					text = "Vous êtes non-authenifié, veuillez se connecter";
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
				const rememberProcess = async ()=>{
					
					setUsernameStored(tmpUser);
					try {
						await AsyncStorage.setItem('usernameToSend',tmpUser);
					} catch (error) {
						  console.log(error);
					}
				};
				rememberProcess();
				showAlert({
					title:"Succès",
					message: data.done,
					alertType: 'success',
					btnLabel:"D'accord",
					leftBtnLabel:"Annuler",
					onPress:() => closeAlert()
				});
        });})
        .catch(function(error) {
          console.log("Error XHR : "+error);
          }).finally(()=>{setSentData(false);});
	};
	const changePassword = async ()=>
	{
		if(attemps>=6)
		{
			showAlert({
				title:"Nombre d'essai dépassé",
				message: "Vous avez essayé 6 fois de ré-initialiser.\nEssayer au plus tart",
				alertType: 'warning',
				btnLabel:"D'accord",
				leftBtnLabel:"Annuler",
				onPress:() => closeAlert()
			});
			return;
		}
		setAttemps(attemps+1);
		setSentData(true);
		await fetch(apiConst.webURL+"/api/account/reset/change",{
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'Accept':'application/json'
			},
			body: JSON.stringify({code:code,username:usernameStored,password:password,password_confirmation:rePassword})
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
				if(statu==411)
				{
					text = "Vous êtes non-authenifié, veuillez se connecter";
				}
				if(statu==500)
				{
					clearProcess();
					setIdUser(null);
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
				clearProcess();
				props.navigation.navigate("First");
				showAlert({
					title:"Erreur",
					message: data.done,
					alertType: 'success',
					btnLabel:"D'accord",
					leftBtnLabel:"Annuler",
					onPress:() => props.navigation.navigate("First")
				});
        });})
        .catch(function(error) {
          console.log("Error XHR : "+error);clearProcess();
          }).finally(()=>{setSentData(false);});
	};

		if(!usernameStored)
			return (
					<View style={styles.container}>
					<Text style={styles.title}>Reinitialisation</Text>
							<TextInput
							  style={{width:'90%',marginRight:'auto',marginLeft:'auto',height:40,borderWidth:1,borderColor:(focused1?'#FB7600':'black'),fontSize:15,lineHeight:18,alignItems:'center',padding:10,marginBottom:20,borderRadius:3}}
							  onFocus={()=> setFocused1(true)}
							  onBlur={()=> setFocused1(false)}
							  onChangeText={text => {setUsername(text);}}
							  placeholder={"Nom d'utilisateur"}
							/>
						  <TouchableOpacity disabled={sentData}
							onPress={() => sendRequest()}
							style={styles.buttons}>
								{!sentData&&<Text style={{ fontSize: 20, color: '#fff',textAlign:'center' }}>Continue</Text>}
								{sentData&&
									<Spinner/>
								}
						  </TouchableOpacity>
							<Text
							style={{width:'90%',marginRight:'auto',marginLeft:'auto',padding:10}}
							>Vous allez recevoir un email à votre email enregister.</Text>
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
		return (
					<View style={styles.container}>
					<Text style={styles.title}>Reinitialisation - Suite</Text>
							<TextInput
							  style={{width:'90%',marginRight:'auto',marginLeft:'auto',height:40,borderWidth:1,borderColor:(focused2?'#FB7600':'black'),fontSize:15,lineHeight:18,alignItems:'center',padding:10,marginBottom:20,borderRadius:3}}
							  onFocus={()=> setFocused2(true)}
							  onBlur={()=> setFocused2(false)}
							  onChangeText={text => {setCode(text);}}
							  placeholder={"Code envoyé"}
							/>
							<TextInput
							  style={{width:'90%',marginRight:'auto',marginLeft:'auto',height:40,borderWidth:1,borderColor:(focused3?'#FB7600':'black'),fontSize:15,lineHeight:18,alignItems:'center',padding:10,marginBottom:20,borderRadius:3}}
							  onFocus={()=> setFocused3(true)}
							  onBlur={()=> setFocused3(false)}
							  onChangeText={text => {setPassword(text);}}
							  placeholder={"Mot de passe"}
							  textContentType='password'
							  secureTextEntry={true}
							/>
							<TextInput
							  style={{width:'90%',marginRight:'auto',marginLeft:'auto',height:40,borderWidth:1,borderColor:(focused4?'#FB7600':'black'),fontSize:15,lineHeight:18,alignItems:'center',padding:10,marginBottom:20,borderRadius:3}}
							  onFocus={()=> setFocused4(true)}
							  onBlur={()=> setFocused4(false)}
							  onChangeText={text => {setRePassword(text);}}
							  placeholder={"Resaisir le mot de passe"}
							  textContentType='password'
							  secureTextEntry={true}
							/>
							<TouchableOpacity disabled={sentData}
								onPress={() => changePassword()}
								style={styles.buttons}>
								{!sentData&&<Text style={{ fontSize: 20, color: '#fff',textAlign:'center' }}>Changer</Text>}
								{sentData&&
									<Spinner/>
								}
							</TouchableOpacity>
							<TouchableOpacity disabled={sentData}
								onPress={() => clearProcess()}
								style={styles.buttonWarning}>
								<Text style={{ fontSize: 20, color: '#fff',textAlign:'center' }}>Annuler</Text>
							</TouchableOpacity>
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

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent:'center'
	},
	title: {
		fontSize: 35,
		fontWeight: 'bold',
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
	buttonWarning:{ 
		backgroundColor: '#ffcc00',
		width:'90%',
		marginRight:'auto',
		marginLeft:'auto',
		textAlign:'center',
		padding:10,
		marginTop:20
	},
	checkbox: {
    alignSelf: "center",
	},
	label: {
		margin: 8,
	},
	checkboxContainer: {
		flexDirection: "row",
		marginBottom: 20,
		width:'90%',
		marginRight:'auto',
		marginLeft:'auto'
	 },
});