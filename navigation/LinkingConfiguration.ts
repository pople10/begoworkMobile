/**
 * Learn more about deep linking with React Navigation
 * https://reactnavigation.org/docs/deep-linking
 * https://reactnavigation.org/docs/configuring-links
 */

import * as Linking from 'expo-linking';

export default {
  prefixes: [Linking.makeUrl('/')],
  config: {
    screens: {
      Root: {
        screens: {
          Home: {
            screens: {
              HomeScreen: 'home',
            },
          },
          Search: {
            screens: {
              SearchScreen: 'search',
            },
          },
		  Orders: {
            screens: {
              OrdersScreen: 'orders',
            },
          },
		  Help: {
            screens: {
              HelpScreen: 'help',
            },
          },
        },
      },
	  Profile:'/',
      NotFound: '*',
    },
  },
};
