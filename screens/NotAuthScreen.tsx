import { StackScreenProps } from '@react-navigation/stack';
import * as React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { RootStackParamList } from '../types';

export default function NotAuth(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vous n'êtes pas authentifié.</Text>
	  <TouchableOpacity onPress={() => props.guestChanger(false)} style={styles.link}>
        <Text style={styles.linkText}>S'authentifier.</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => props.navigation.goBack()}>
        <Text style={styles.linkText}>Revenir à l'acceuil.</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  link: {
    marginTop: 10,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: '#2e78b7',
  },
});
