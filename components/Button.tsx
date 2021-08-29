import React from 'react';
import {View,Dimensions,TouchableOpacity,Text} from 'react-native';

class ButtonCustom extends React.PureComponent {
  state = {};
  render() {
	const {action,bgColor,borColor,borWidth,color,text,weight} = this.props;
    return (
		<TouchableOpacity 
			onPress={() => action()}
			style={{ backgroundColor: bgColor, width:'90%', marginRight:'auto', marginLeft:'auto', textAlign:'center', padding:10,borderColor:borColor,borderWidth:borWidth }}>
			<Text style={{ fontSize: (Dimensions.get('screen').width/20), color: color,textAlign:'center',fontWeight:weight }}>{text}</Text>
		</TouchableOpacity>
    );
  }
}


export default ButtonCustom;