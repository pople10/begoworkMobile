import React,{useState,useEffect,ReactDOM} from 'react';
import { View, ScrollView, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TextInput,Easing,Animated } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';
import apiConst from '../constants/api';
import Swal from 'sweetalert2';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Spinner from '../components/Spinner';
import CustomisableAlert ,{showAlert,closeAlert } from "react-native-customisable-alert";
import Colors from '../constants/Colors';
import useColorScheme from '../hooks/useColorScheme';

export default function Login (props) {
	const [username,setUsername]=useState(null);
	const [password,setPassword]=useState(null);
	const [sentData,setSentData]=useState(false);
	const [token,setToken]=useState(null);
	const [focused1,setFocused1]=useState(false);
	const [focused2,setFocused2]=useState(false);
	const colorScheme = useColorScheme();
	useEffect(()=>{
		  
	  },[]);
	const login = async ()=>
	{
		setSentData(true);
		await fetch(apiConst.webURL+"/api/account/login",{
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'Accept':'application/json'
			},
			body: JSON.stringify({username:username,password:password,expo_token:props.expoPushToken})
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
				let storeToken = async (token) => {
				  try {
					await AsyncStorage.setItem('token',token);
				  } catch (error) {
					showAlert({
						title:"Erreur",
						message: "Erreur se produit dans l'application",
						alertType: 'error',
						btnLabel:"D'accord",
						leftBtnLabel:"Annuler",
						onPress:() => closeAlert()
					});
				  }
				};
				let tokenFinal = data.token;
				storeToken(tokenFinal);
				props.tokenChanger(tokenFinal);
        });})
        .catch(function(error) {
          console.log("Error XHR : "+error);
          }).finally(()=>{setSentData(false);});
	};
		
		return (
					<View style={styles.container}>
					  <Text style={styles.title}>Connexion</Text>
					  <TextInput
						  style={{width:'90%',marginRight:'auto',marginLeft:'auto',height:40,borderWidth:1,borderColor:(focused1?'#FB7600':'black'),fontSize:15,lineHeight:18,alignItems:'center',padding:10,marginBottom:20,borderRadius:3}}
						  onFocus={()=> setFocused1(true)}
						  onBlur={()=> setFocused1(false)}
						  onChangeText={text => {setUsername(text);}}
						  placeholder={"Nom d'utilisateur"}
						/>
						<TextInput
						  style={{width:'90%',marginRight:'auto',marginLeft:'auto',height:40,borderWidth:1,borderColor:(focused2?'#FB7600':'black'),fontSize:15,lineHeight:18,alignItems:'center',padding:10,marginBottom:20,borderRadius:3}}
						  onFocus={()=> setFocused2(true)}
						  onBlur={()=> setFocused2(false)}
						  onChangeText={text => {setPassword(text);}}
						  placeholder={"Mot de passe"}
						  textContentType='password'
						  secureTextEntry={true}
						/>
					  <TouchableOpacity disabled={sentData}
						onPress={() => login()}
						style={styles.buttons}>
							{!sentData&&<Text style={{ fontSize: 20, color: '#fff',textAlign:'center' }}>Se connecter</Text>}
							{sentData&&
								<Spinner/>
							}
					  </TouchableOpacity>
					  <Text style={{fontSize:18,color:'grey',width:'90%',marginRight:'auto',marginLeft:'auto'}} 
					  onPress={()=>props.navigation.replace("Reset")}>Mot de passe oublié?</Text>
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
	}
});