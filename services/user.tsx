import apiConst from '../constants/api';

export const getFirstname = async (token) => {
	let firstname = null;
	await fetch(apiConst.webURL+"/api/user/profile",{
			method: 'GET',
			headers: {
			  'Content-Type': 'application/json',
			  'Accept':'application/json',
			  'Authorization': 'Bearer '+token, 
			}
		  })
		.then(function(response) {
			if(response.status==401 ||response.status==411)
			{
				firstname=false;
				return false;
			}
			return response.json().then(function(data) {
				firstname=data.firstname;
			});
		})
        .catch(function(error) {
			
        })
		.finally(()=>{
			  
		});
	return firstname;
};

export const getProfileData = async (token) => {
	let data = null;
	await fetch(apiConst.webURL+"/api/user/profile",{
			method: 'GET',
			headers: {
			  'Content-Type': 'application/json',
			  'Accept':'application/json',
			  'Authorization': 'Bearer '+token, 
			}
		  })
		.then(function(response) {
			if(response.status==401 ||response.status==411)
			{
				data=false;
				return false;
			}
			return response.json().then(function(datos) {
				data=datos;
			});
		})
        .catch(function(error) {
			
        })
		.finally(()=>{
			  
		});
	return data;
};
