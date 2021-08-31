import React from 'react';
import {
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import { AntDesign   } from '@expo/vector-icons';

class GoBackBar extends React.PureComponent {
  state = {};
  render() {
    const {navigation} = this.props;
    return (
      <SafeAreaView>
          <View style={styles.mainNav}>
            <TouchableOpacity
              onPress={() => {
                navigation.goBack();
              }}>
              <AntDesign name="back" size={35} style={{marginTop:20}} color="black" />
            </TouchableOpacity>
          </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  mainNav: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  logo: {
    width: 50,
    height: 50,
  },
});


export default GoBackBar;
