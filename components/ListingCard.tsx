import React from 'react';
import { View, Text, Image, Dimensions, TouchableOpacity} from 'react-native';
import { Card, ListItem, Button, Icon } from 'react-native-elements';
import { Feather } from '@expo/vector-icons';

const ListingCard = (props) => {
	
  return (
	<TouchableOpacity onPress={()=>{props.reserve(props.idListing);}}>
		<Card style={{marginHorizontal:20}}>
			<Card.Image style={{width:(dim.width/1.2),height:(dim.height/5)}} source={{uri:props.imageURL}}/>
			<Card.Title>{props.title}</Card.Title>
			<Text style={{fontSize:15,marginBottom: 10}}>
				{props.address}
			</Text>
			<View style={{flexDirection: 'row-reverse'}}>
				<Text style={{fontSize:15,color:"#db3a3a"}}>A partir de {props.low}</Text>
			</View>
		</Card>
	</TouchableOpacity>
  )
}
const dim = Dimensions.get("screen");

export default ListingCard;