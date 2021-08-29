import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const FlatListGrid = (props) => {

  return (
	<TouchableOpacity onPress={()=>{props.action(props.orderID);}}>
		<View style={styles.item}>
		  <View style={styles.itemLeft}>
			<View style={[styles.square,{backgroundColor:props.squareColor}]}></View>
			<Text style={styles.itemText}>{props.text}</Text>
		  </View>
		  <AntDesign name="arrowright" size={24} color="black" />
		</View>
	</TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
	borderColor:'#e7f0f7',
	borderWidth:1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap'
  },
  square: {
    width: 24,
    height: 24,
    opacity: 0.4,
    borderRadius: 5,
    marginRight: 15,
  },
  itemText: {
    maxWidth: '90%',
  },
  circular: {
    width: 12,
    height: 12,
    borderColor: '#55BCF6',
    borderWidth: 2,
    borderRadius: 5,
  },
});

export default FlatListGrid;