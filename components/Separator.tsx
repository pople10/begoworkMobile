import React from 'react';
import {Dimensions,StyleSheet} from 'react-native';
import {View } from './Themed';
class Separator extends React.PureComponent {
  state = {};
  render() {
    return (
      <View style={[styles.separator,{marginTop:10}]} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
    );
  }
}
const styles = StyleSheet.create({
	separator: {
		marginVertical: 20,
		height: 1.5,
		width: '100%',
	}
});

export default Separator;