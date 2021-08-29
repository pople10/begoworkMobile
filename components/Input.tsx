import React from 'react';
import {View,Dimensions,TextInput,Text} from 'react-native';

class Input extends React.PureComponent {
	constructor(props) {
		super(props);
		this.state = {focused:false};
	}
  render() {
	const {action,placeholder,type,secured,value,globalAction} = this.props;
    return (
		<TextInput
			style={{width:'90%',marginRight:'auto',marginLeft:'auto',height:40,borderWidth:1,borderColor:(this.state.focused?'#FB7600':'black'),fontSize:15,lineHeight:18,alignItems:'center',padding:10,marginBottom:20,borderRadius:3}}
			onFocus={()=> {this.setState({focused:true});}}
			onBlur={()=> {this.setState({focused:false});}}
			onChangeText={text => {action(text);}}
			placeholder={placeholder}
			textContentType={type}
			secureTextEntry={secured}
			value={value}
			onSubmitEditing={globalAction}
		/>
    );
  }
}


export default Input;