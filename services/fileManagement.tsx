import { View, Image, Button, Platform } from 'react-native';

export const createFormData = (photo, body = {},name) => {
	const data = new FormData();
	if(photo!=null)
	{
		let extention = photo.uri.split(".");
		let namos = photo.uri.split("/");
		data.append(name, {
			name: namos[namos.length-1],
			type: photo.type+"/"+extention[extention.length-1],
			uri: Platform.OS === 'ios' ? photo.uri.replace('file://', '') : photo.uri,
		});
	}
	Object.keys(body).forEach((key) => {
		data.append(key, body[key]);
	});

	return data;
};