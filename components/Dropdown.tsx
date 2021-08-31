import RNPickerSelect from 'react-native-picker-select';
import * as React from 'react';

export default function Dropdown (props) {
    return (
			<RNPickerSelect
				onValueChange={props.handler}
				items={props.items}
				placeholder={props.placeholder}
				value={props.value}
				useNativeAndroidPickerStyle={true}
			/>
    );
};