import React,{useEffect,useState,useRef} from 'react'
import {Image, StyleSheet,Dimensions,ActivityIndicator,SafeAreaView,TouchableOpacity,ScrollView,TextInput,Button,Platform} from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Text, View } from '../components/Themed';
import ButtonCustom from '../components/Button';
import Spinner from '../components/Spinner';
import Input from '../components/Input';
import Loader from '../components/customLoader';
import {getFirstname} from '../services/user';
import { AntDesign,Feather } from '@expo/vector-icons';
import apiConst from '../constants/api';
import CustomisableAlert ,{showAlert,closeAlert } from "react-native-customisable-alert";
import {getProfileData} from '../services/user';
import {createFormData} from '../services/fileManagement';
import * as ImagePicker from 'expo-image-picker';
import NotAuth from '../screens/NotAuthScreen';
import { Icon } from 'react-native-elements';

export default function Profile (props) {
	const [sentDataAccount,setSentDataAccount] = useState(false);
	const [sentDataUser,setSentDataUser] = useState(false);
	const [sentDataRemove,setSentDataRemove] = useState(false);
	const [flagUpdateData,toggleFlag] = useState(false);
	
	const [password,setPassword] = useState(null);
	const [rePassword,setRePassword] = useState(null);
	
	const [email,setEmail] = useState(null);
	const [firstname,setFirstname] = useState(null);
	const [lastname,setLastname] = useState(null);
	const [photo,setPhoto] = useState(null);
	const [photoURL,setPhotoURL] = useState(null);
	
	const [loaded,setLoaded]=useState(false);
	const [photoLoaded,setPhotoLoaded]=useState(false);
	
	
	useEffect(()=>{
		if(props.guest)
			setLoaded(true);
		if(!props.guest)
			(async () => {
				let profileData = await getData();
				if(profileData===false)
					return;
				setFirstname(profileData.firstname);
				setLastname(profileData.lastname);
				setEmail(profileData.email);
				setPhotoURL(profileData.photoUrl);
				setLoaded(true);
			})();
  },[flagUpdateData]);
  
  /*************** Methods *******************/
  const closeSession = async ()=>
  {
	 props.tokenChanger(null);
	(async () => {try { await AsyncStorage.removeItem("token");/*console.log("deleted"); */} catch(exception) { /*console.log("logged out"); */}})();
  };
  const updatePassword = async ()=>
	{
		setSentDataAccount(true);
		await fetch(apiConst.webURL+"/api/account/change/password",{
			method: 'POST',
			headers: {
			  'Content-Type': 'application/json',
			  'Accept':'application/json',
			  'Authorization': 'Bearer '+props.token,
			},
			body: JSON.stringify({password:password,password_confirmation:rePassword})
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
					onPress:() => {setPassword(null);setRePassword(null);}
				});
        });})
        .catch(function(error) {
          console.log("Error XHR : "+error);
          }).finally(()=>{setSentDataAccount(false);});
	};
	const getData = async () =>
	{
		let data = await getProfileData(props.token);
		if(data===false)
		{
			await closeSession();
			return data;
		}
		if(data===null || (typeof data!=="object"))
		{
			showAlert({
				title:"Erreur",
				message: "Un erreur se produit\nEssayer plus tart",
				alertType: 'error',
				btnLabel:"D'accord",
				leftBtnLabel:"Annuler",
				onPress:() => {props.navigate.goBack();}
			});	
			return false;
		}
		return data;
	}
	const uploadPhoto = async ()=>
	{
		let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

		if (permissionResult.granted === false) {
		  showAlert({
				title:"Erreur",
				message: "Vous ne pouvez pas changer la photo sans permessions.",
				alertType: 'error',
				btnLabel:"D'accord",
				leftBtnLabel:"Annuler",
				onPress:() => closeAlert()
			});
		  return;
		}
		let result = await ImagePicker.launchImageLibraryAsync({
		  mediaTypes: ImagePicker.MediaTypeOptions.Images,
		  allowsEditing: true,
		  aspect: [4, 4],
		  quality: 1,
		});
		if (!result.cancelled) {
		  setPhoto(result);
		  setPhotoURL(result.uri);
		}
	};
	const uploadPhotoCamera = async ()=>
	{
		const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
		if (permissionResult.granted === false) {
			showAlert({
				title:"Erreur",
				message: "Vous ne pouvez pas changer la photo sans permessions.",
				alertType: 'error',
				btnLabel:"D'accord",
				leftBtnLabel:"Annuler",
				onPress:() => closeAlert()
			});
		  return;
		}
		const result = await ImagePicker.launchCameraAsync();
		if (!result.cancelled) {
		  setPhoto(result);
		  setPhotoURL(result.uri);
		}
	}
	const updateProfile = async ()=>
	{
		setSentDataUser(true);
		const datoss = createFormData(photo,{firstname:firstname,lastname:lastname,email:email},"photoAttachement");
		await fetch(apiConst.webURL+"/api/user/profile/change",{
			method: 'POST',
			headers: {
				'Content-Type': 'multipart/form-data',
				'Accept':'application/json',
				'Authorization': 'Bearer '+props.token,
			},
			body: datoss,
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
					onPress:() => closeAlert()
				});
        });})
        .catch(function(error) {
          console.log("Error XHR : "+error);
          }).finally(()=>{setSentDataUser(false);toggleFlag(!flagUpdateData);if(photo){setPhotoLoaded(false);setPhoto(null);}});
	}
	const logout = async ()=>
	{
		setLoaded(false);
		await fetch(apiConst.webURL+"/api/account/logout?plainTextToken="+props.token+"&expo_token="+props.expoPushToken,{
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Accept':'application/json',
				'Authorization': 'Bearer '+props.token,
			}
		  })
		.then(function(response) {
			let statu = response.status;
			if(statu!=200)
			{
				setLoaded(true);
				return;
				showAlert({
					title:"Erreur",
					message: "Se déconnexion produit un erreur.\nRessayer après!",
					alertType: 'error',
					btnLabel:"D'accord",
					leftBtnLabel:"Annuler",
					onPress:() => closeAlert()
				});
			}
			return response.json().then(function(data) {
				if(typeof data==="object")
					(async () => {await closeSession();})();
				else
				{
					setLoaded(true);
						showAlert({
						title:"Erreur",
						message: "Se déconnexion produit un erreur.\nRessayer après!",
						alertType: 'error',
						btnLabel:"D'accord",
						leftBtnLabel:"Annuler",
						onPress:() => closeAlert()
					});
				}
        });})
        .catch(function(error) {
				console.log("Error XHR : "+error);
				setLoaded(true);
				showAlert({
					title:"Erreur",
					message: "Se déconnexion produit un erreur.\nRessayer après!",
					alertType: 'error',
					btnLabel:"D'accord",
					leftBtnLabel:"Annuler",
					onPress:() => closeAlert()
				});
				return;
          }).finally(()=>{{}});
	};
	const removeAccountFinal = async ()=>
	{
		setSentDataRemove(true);
		await fetch(apiConst.webURL+"/api/account/delete",{
			method: 'DELETE',
			headers: {
			  'Content-Type': 'application/json',
			  'Accept':'application/json',
			  'Authorization': 'Bearer '+props.token,
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
				(async () => {await closeSession();})();
        });})
        .catch(function(error) {
          console.log("Error XHR : "+error);
          }).finally(()=>{setSentDataRemove(false);});
	};
	const removeAccount = async ()=>
	{
		showAlert({
			title:"Confirmation",
			message: "Etes-vous sûr de supprimer votre compte?",
			alertType: 'warning',
			btnLabel:"Oui",
			leftBtnLabel:"Non",
			onPress:() => {closeAlert();(async () => {await removeAccountFinal();})();}
		});
	}
  /*************** END Methods *******************/
	
	if(!loaded)
		return <Loader/>;
	if(props.guest)
			return <NotAuth navigation={props.navigation} guestChanger={props.guestChanger}/>;
	return (
	<SafeAreaView>
			<View style={{position:'absolute',top:(Platform.OS === 'ios'?"7%":"5%"),left:'3%',backgroundColor:"transparent",zIndex:1000000}}>
				<TouchableOpacity
				  onPress={() => {
					props.navigation.goBack();
				  }}>
				  <AntDesign name="back" size={35} color="black" />
				</TouchableOpacity>
			</View>
			<View style={{position:'absolute',top:(Platform.OS === 'ios'?"7%":"5%"),right:'3%',backgroundColor:"transparent",zIndex:1000000}}>
				<TouchableOpacity
				  onPress={() => {
					(async () => {await logout();})();
				  }}>
				  <AntDesign name="logout" size={35} color="red" />
				</TouchableOpacity>
			</View>
		<ScrollView contentContainerStyle={{ flexGrow: 1,alignItems: 'center',justifyContent: 'center',backgroundColor:'#fff',paddingTop:'18%'}}>
			<Text style={styles.title}>Profile</Text>
			<View style={{overflow: 'hidden',alignItems: 'center'}}>
			<Image resizeMode="cover" style={{width: (photoLoaded?dim.width/3:1), height: (photoLoaded?dim.width/3:1),marginBottom:'5%',borderRadius:(dim.width/6)}} 
				source={{uri: photoURL }}
				onLoadEnd={()=>{setPhotoLoaded(true);return true;}}/>
			{!photoLoaded&&<ActivityIndicator size="large" color="#000"/>}
			<View style={[styles.containerss,{marginBottom:10}]}>
				<View style={[styles.buttonContainer,{marginRight:10}]}>
				  <Icon
				  onPress={()=>uploadPhotoCamera()}  
				  type="antdesign" raised name="camera" color="black" />
				</View>
				<View style={[styles.buttonContainer,{marginLeft:10}]}>
				  <Icon
				  onPress={()=>uploadPhoto()} 
				  type="feather" raised name="upload" color="black" />
				</View>
				</View>
			</View>
			<Input value={email} secured={false} type="emailAddress" placeholder="Email" action={setEmail}/>
			<Input value={firstname} secured={false} type="name" placeholder="Prénom" action={setFirstname}/>
			<Input value={lastname} secured={false} type="familyName" placeholder="Nom" action={setLastname}/>
			<TouchableOpacity disabled={sentDataAccount||sentDataUser||sentDataRemove}
				onPress={() => updateProfile()}
				style={[styles.buttons,{marginBottom:'5%'}]}>
				{!sentDataUser&&<Text style={{ fontSize: 20, color: '#fff',textAlign:'center' }}>Enregistrer</Text>}
				{sentDataUser&&
				<Spinner/>
				}
			</TouchableOpacity>
			<Text style={styles.title}>Mot de passe</Text>
			<Input value={password} secured={true} type="password" placeholder="Mot de passe" action={setPassword}/>
			<Input value={rePassword} secured={true} type="password" placeholder="Resaisir le mot de passe" action={setRePassword}/>
			<TouchableOpacity disabled={sentDataAccount||sentDataUser||sentDataRemove}
				onPress={() => updatePassword()}
				style={styles.buttons}>
				{!sentDataAccount&&<Text style={{ fontSize: 20, color: '#fff',textAlign:'center' }}>Changer</Text>}
				{sentDataAccount&&
				<Spinner/>
				}
			</TouchableOpacity>
			<TouchableOpacity disabled={sentDataAccount||sentDataUser||sentDataRemove}
				onPress={() => removeAccount()}
				style={styles.buttonWarning}>
				{!sentDataRemove&&<Text style={{ fontSize: 20, color: '#fff',textAlign:'center' }}>Supprimer mon compte</Text>}
				{sentDataRemove&&
				<Spinner/>
				}
			</TouchableOpacity>
			<CustomisableAlert titleStyle={{ fontSize: 18, fontWeight: "bold", }} btnLabelStyle={{ color: 'white', width:'100%', textAlign: 'center', backgroundColor:"#FB7600" }} />
		</ScrollView>
	</SafeAreaView>
  );
}
const dim = Dimensions.get("screen");

const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
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
		width: "40%",
		height: (dim.height/3.5),
		resizeMode: 'cover',
	},
	bottomContainer:{
		width:'90%',
		marginLeft:'auto',
		marginRight:'auto',
		flexDirection: "row",
		height:(dim.height/3.5),
		justifyContent:'space-between',
		marginTop:(dim.height/15),
		borderWidth:0.5
	},
	logo: {
		width: 50,
		height: 50,
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
		backgroundColor: '#ff3e2e',
		width:'90%',
		marginRight:'auto',
		marginLeft:'auto',
		textAlign:'center',
		padding:10,
		marginTop:20,
		marginBottom:20
	},
	containerss: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonContainer: {
  }
})
