import React from 'react';
import {View,SafeAreaView,TouchableOpacity,Image,StyleSheet,Dimensions} from 'react-native';
import {EvilIcons} from '@expo/vector-icons';
import Separator from './Separator';

class TopBar extends React.PureComponent {
  state = {};
  render() {
    return (
      <SafeAreaView style={{ position:'relative' }}>
          <View style={styles.mainNav}>
            <TouchableOpacity
            style={{ position:"absolute",right:5,top:0 }}
              onPress={() => {
                this.props.navigation.navigate("Profile");
              }}>
              <EvilIcons name="user" size={(dim.width/10)} color="black" />
            </TouchableOpacity>
			<Image style={styles.logo} source={require("../assets/images/logoTransparent.png")}/>
          </View>
		  
      </SafeAreaView>
    );
  }
}
const dim = Dimensions.get('screen');
const styles = StyleSheet.create({
  mainNav: {
    flex: 1,
    flexDirection: 'row',
    width:"100%"
  },
  logo: {
    width: (dim.width/10),
	height: (dim.width/10),
	resizeMode: 'contain',
	marginRight:'auto',
	marginLeft:'auto'
  },
});


export default TopBar;