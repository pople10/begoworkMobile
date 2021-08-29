import React,{useEffect,useState} from 'react';

import { Easing,Animated } from 'react-native';
import { EvilIcons } from '@expo/vector-icons';

export default function Spinner() {
	
	const spinValue = new Animated.Value(0);
	  useEffect(() => {
		 
		Animated.loop( 
		  Animated.sequence([ 
			Animated.delay(100), 
			Animated.timing( 
			  spinValue, 
			  { 
				toValue: 1, 
				duration: 800, 
				useNativeDriver: true 
			  }
			), 
			Animated.timing(
			  spinValue, 
			  { 
				toValue: 0, 
				duration: 0, 
				useNativeDriver: true 
			  }
			),
		  ]),
		  {} 
		).start(); 
	  })
	  const rotateAnimation = spinValue.interpolate({
		inputRange: [0, 1],
		outputRange: ['0deg', '360deg']
	  })
  return (
		<Animated.View style={{ transform: [{ rotate: rotateAnimation }],textAlign:'center' }}>
			<EvilIcons style={{textAlign:'center'}} name="spinner-3" size={32} color="#fff" />
		</Animated.View>
		);
}