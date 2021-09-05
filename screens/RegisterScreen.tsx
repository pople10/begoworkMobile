import React,{useState,useEffect,ReactDOM} from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity, Platform,Picker} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TextInput,Easing,Animated,CheckBox,Linking } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import apiConst from '../constants/api';
import Swal from 'sweetalert2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from '../components/Spinner';
import Dropdown from '../components/Dropdown';
import CustomisableAlert ,{showAlert,closeAlert } from "react-native-customisable-alert";
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

export default function Register ({tokenChanger,...rest}) {
	const [username,setUsername]=useState(null);
	const [password,setPassword]=useState(null);
	const [rePassword,setRePassword]=useState(null);
	const [title,setTitle]=useState('Mr.');
	const [email,setEmail]=useState(null);
	const [fname,setFname]=useState(null);
	const [lname,setLname]=useState(null);
	const [idUser,setIdUser]=useState(null);
	
	const [enabledEmails,setEnabledEmails]=useState(false);
	const [enabledNotification,setEnabledNotification]=useState(false);
	const [sentData,setSentData]=useState(false);
	const [token,setToken]=useState(null);
	
	const [focused1,setFocused1]=useState(false);
	const [focused2,setFocused2]=useState(false);
	const [focused3,setFocused3]=useState(false);
	const [focused4,setFocused4]=useState(false);
	const [focused5,setFocused5]=useState(false);
	const [focused6,setFocused6]=useState(false);
	
	const colorScheme = useColorScheme();
	
	const openURL = (url) => {
	  Linking.openURL(url).catch((err) => console.error('An error occurred', err));
	}
	
	const clearProcess = async ()=>{
		try {
			await AsyncStorage.removeItem('idUserToInsert');
		} catch (error) {  
		}
	};
	const login = async ()=>
	{
		setSentData(true);
		await fetch(apiConst.webURL+"/api/account/login",{
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'Accept':'application/json'
			},
			body: JSON.stringify({username:username,password:password,expo_token:rest.expoPushToken})
		  })
		.then(function(response) {
			return response.json().then(function(data) {
				let storeToken = async (token) => {
				  try {
					await AsyncStorage.setItem('token',token);
				  } catch (error) {
					
				  }
				};
				let tokenFinal = data.token;
				storeToken(tokenFinal);
				tokenChanger(tokenFinal);
        });})
        .catch(function(error) {
          console.log("Error XHR : "+error);
          }).finally(()=>{setSentData(false);});
	};
	
	
	useEffect(()=>{
		const remindProcess = async ()=>{
			try {
				let value = await AsyncStorage.getItem('idUserToInsert');
				setIdUser(parseInt(value));
			} catch (error) {
					  
			}
		};
		remindProcess();
	  });
	  
	const registerUser = async ()=>
	{
		setSentData(true);
		await fetch(apiConst.webURL+"/api/user/signup",{
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'Accept':'application/json'
			},
			body: JSON.stringify({title:title,firstname:fname,lastname:lname,email:email})
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
				try {
					await AsyncStorage.setItem('idUserToInsert',data.toString());
				  } catch (error) {
					  
				  }
				};
				rememberProcess();
				setIdUser(data);
        });})
        .catch(function(error) {
          console.log("Error XHR : "+error);
          }).finally(()=>{setSentData(false);});
	};
	const registerAccount = async ()=>
	{
		setSentData(true);
		await fetch(apiConst.webURL+"/api/account/signup",{
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'Accept':'application/json'
			},
			body: JSON.stringify({idUser:idUser,username:username,password:password,idRole:1,idType:1,enabledNotification:enabledNotification,enabledEmails:enabledEmails,password_confirmation:rePassword})
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
				showAlert({
					title:"Succès",
					message: data.done,
					alertType: 'success',
					btnLabel:"D'accord",
					leftBtnLabel:"Annuler",
					onPress:() => login()
				});
        });})
        .catch(function(error) {
          console.log("Error XHR : "+error);clearProcess();
          }).finally(()=>{setSentData(false);});
	};

		if(!idUser)
			return (
					<View style={styles.container}>
					<Text style={styles.title}>Registre</Text>
								{Platform.OS === 'ios'?
								<View style={{width:'90%',marginRight:'auto',marginLeft:'auto',height:40,borderWidth:1,borderColor:'black',fontSize:15,lineHeight:18,alignItems:'center',padding:10,marginBottom:20,borderRadius:3}}>
									<Dropdown value={title} handler={setTitle}
									placeholder={{ label: 'Selectioner le genre...', value: null, color: '#9EA0A4' }}
									items={[{label: 'Monsieur', value: 'Mr.', key: 'Mr.', color: 'black', inputLabel: 'Monsieur'},{label: 'Madamme', value: 'Mrs.', key: 'Mrs.', color: 'black', inputLabel: 'Madamme'}]}/>
								</View>
								:
								<View style={{borderWidth:1,width:'90%',marginRight:'auto',borderColor:'black',marginLeft:'auto',marginBottom:20}}>
									<Picker
										style={{height:40,fontSize:15}}
									  selectedValue={title}
									  onValueChange={(itemValue, itemIndex) =>
										setTitle(itemValue)
									  }>
									  <Picker.Item label="Monsieur" value="Mr." />
									  <Picker.Item label="Madamme" value="Mrs." />
									</Picker>
								</View>}
							<TextInput
							  style={{width:'90%',marginRight:'auto',marginLeft:'auto',height:40,borderWidth:1,borderColor:(focused1?'#FB7600':'black'),fontSize:15,lineHeight:18,alignItems:'center',padding:10,marginBottom:20,borderRadius:3}}
							  onFocus={()=> setFocused1(true)}
							  onBlur={()=> setFocused1(false)}
							  onChangeText={text => {setFname(text);}}
							  placeholder={"Prénom"}
							/>
							<TextInput
							  style={{width:'90%',marginRight:'auto',marginLeft:'auto',height:40,borderWidth:1,borderColor:(focused2?'#FB7600':'black'),fontSize:15,lineHeight:18,alignItems:'center',padding:10,marginBottom:20,borderRadius:3}}
							  onFocus={()=> setFocused2(true)}
							  onBlur={()=> setFocused2(false)}
							  onChangeText={text => {setLname(text);}}
							  placeholder={"Nom"}
							/>
							<TextInput
							  style={{width:'90%',marginRight:'auto',marginLeft:'auto',height:40,borderWidth:1,borderColor:(focused3?'#FB7600':'black'),fontSize:15,lineHeight:18,alignItems:'center',padding:10,marginBottom:20,borderRadius:3}}
							  onFocus={()=> setFocused3(true)}
							  onBlur={()=> setFocused3(false)}
							  onChangeText={text => {setEmail(text);}}
							  placeholder={"Email"}
							  textContentType="emailAddress"
							/>
						  <TouchableOpacity disabled={sentData}
							onPress={() => registerUser()}
							style={styles.buttons}>
								{!sentData&&<Text style={{ fontSize: 20, color: '#fff',textAlign:'center' }}>Continue</Text>}
								{sentData&&
									<Spinner/>
								}
						  </TouchableOpacity>
							<Text
							style={{width:'90%',marginRight:'auto',marginLeft:'auto',padding:10}}
							>By signing up, you agree to Begowork’s <Text style={{color:"#FB7600"}} 
							onPress={()=>openURL("https://begowork.ma/terms-and-conditions")}>Terms of Service</Text> and <Text style={{color:"#FB7600"}}
							onPress={()=>openURL("https://begowork.ma/privacy-policy")}>Privacy Policy</Text>.</Text>
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
					<Text style={styles.title}>Registre - Suite</Text>
							<TextInput
							  style={{width:'90%',marginRight:'auto',marginLeft:'auto',height:40,borderWidth:1,borderColor:(focused4?'#FB7600':'black'),fontSize:15,lineHeight:18,alignItems:'center',padding:10,marginBottom:20,borderRadius:3}}
							  onFocus={()=> setFocused4(true)}
							  onBlur={()=> setFocused4(false)}
							  onChangeText={text => {setUsername(text);}}
							  placeholder={"Nom d'utilisateur"}
							/>
							<TextInput
							  style={{width:'90%',marginRight:'auto',marginLeft:'auto',height:40,borderWidth:1,borderColor:(focused5?'#FB7600':'black'),fontSize:15,lineHeight:18,alignItems:'center',padding:10,marginBottom:20,borderRadius:3}}
							  onFocus={()=> setFocused5(true)}
							  onBlur={()=> setFocused5(false)}
							  onChangeText={text => {setPassword(text);}}
							  placeholder={"Mot de passe"}
							  textContentType='password'
							  secureTextEntry={true}
							/>
							<TextInput
							  style={{width:'90%',marginRight:'auto',marginLeft:'auto',height:40,borderWidth:1,borderColor:(focused6?'#FB7600':'black'),fontSize:15,lineHeight:18,alignItems:'center',padding:10,marginBottom:20,borderRadius:3}}
							  onFocus={()=> setFocused6(true)}
							  onBlur={()=> setFocused6(false)}
							  onChangeText={text => {setRePassword(text);}}
							  placeholder={"Resaisir le mot de passe"}
							  textContentType='password'
							  secureTextEntry={true}
							/>
							<View style={styles.checkboxContainer}>
								<CheckBox
								  value={enabledEmails}
								  onValueChange={setEnabledEmails}
								  style={styles.checkbox}
								/>
								
							<Text style={styles.label}>Voulez-vous recevoir des emails?</Text>
							</View>
							<View style={styles.checkboxContainer}>
								<CheckBox
								  value={enabledNotification}
								  onValueChange={setEnabledNotification}
								  style={styles.checkbox}
								/>
								<Text style={styles.label}>Voulez-vous recevoir des notification?</Text>
							</View>
							<TouchableOpacity disabled={sentData}
								onPress={() => registerAccount()}
								style={styles.buttons}>
								{!sentData&&<Text style={{ fontSize: 20, color: '#fff',textAlign:'center' }}>Registre</Text>}
								{sentData&&
									<Spinner/>
								}
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