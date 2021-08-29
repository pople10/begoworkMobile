import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/welcome')],
  config: {
    screens: {
          Login:'login',
		  Register:'register',
		  First:'welcome',
		  Reset:'reset'
      }
  }
};
