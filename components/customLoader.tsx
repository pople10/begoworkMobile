import React from 'react';
import {View,StyleSheet,ActivityIndicator} from 'react-native';

class LoaderCustom extends React.PureComponent {
  state = {};
  render() {
    return (
		<View style={[styles.container, styles.horizontal]}>
			<ActivityIndicator size="large" color="#000"/>
		</View>    );
  }
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor:'#fff'
	},
	horizontal: {
		flexDirection: "row",
		padding: 10
	}
})

export default LoaderCustom;