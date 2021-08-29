import AsyncStorage from '@react-native-async-storage/async-storage';

const getTokenService = async function()
{
	try {
		return await AsyncStorage.getItem('token');
	} catch(e) {
		console.log("sdd");
		return null;
	}
}
export default getTokenService;