import React,{useState} from 'react';
import {View,Dimensions,Text,Keyboard,TouchableWithoutFeedback,Platform} from 'react-native';
import { Input } from 'react-native-elements';
import { Fontisto } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import DateTimePickerModal from "react-native-modal-datetime-picker";

const PickerTime = (props)=> {
	const [showed,setShowed] = useState(false);
	const [type,setType] = useState(false);
	const {action,value,placeholder} = props;
	const formatDate = (date) =>
	{
		let tempDate = new Date(date);
		return tempDate.getFullYear()+"-"+((tempDate.getMonth()+1)<10?"0"+(tempDate.getMonth()+1):(tempDate.getMonth()+1))+"-"+(tempDate.getDate()<10?"0"+tempDate.getDate():tempDate.getDate());
	}
	const formatTime = (date) =>
	{
		let tempDate = new Date(date);
		return (tempDate.getHours()<10?"0"+tempDate.getHours():tempDate.getHours())+":"+(tempDate.getMinutes()<10?"0"+tempDate.getMinutes():tempDate.getMinutes())+":00";
	}
	const dateAction = (event, date)=>
	{
		if(date)
		{
			action(formatDate(date));
			setType("time");
		}
		else
		{
			setShowed(false);
			action(null);
			setType("date");
		}
	}
	const timeAction = (event, date)=>
	{
		setShowed(false);
		if(date)
		{
			action(value+" "+formatTime(date));
		}
		else
		{
			action(null);
		}
	}
	
	const getTimeFromIOS = (date) =>
	{
		let tempDate = new Date(date);
		let dateRes =  tempDate.getFullYear()+"-"+((tempDate.getMonth()+1)<10?"0"+(tempDate.getMonth()+1):(tempDate.getMonth()+1))+"-"+(tempDate.getDate()<10?"0"+tempDate.getDate():tempDate.getDate())+" "+(tempDate.getHours()<10?"0"+tempDate.getHours():tempDate.getHours())+":"+(tempDate.getMinutes()<10?"0"+tempDate.getMinutes():tempDate.getMinutes())+":00";
		action(dateRes);
		setShowed(false);
	}
	
	const cancelDateIOS = () =>
	{
		action(null);
		setShowed(false);
	}
	
	let widthVar="100%";
	if(props.width)
		widthVar=props.width;
		return (
			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<View style={{width:widthVar}}>
					<Input placeholder={placeholder} value={value} disabled={true}
						rightIcon={<Fontisto name="date" size={24} color="black"   
						onPress={()=>{setShowed(true);}}/>}/>
					
					<DateTimePickerModal
					isVisible={showed}
					mode="datetime"
					onConfirm={(date)=>getTimeFromIOS(date)}
					onCancel={()=>cancelDateIOS()}
					minimumDate={new Date()}
				  />
				</View>
			</TouchableWithoutFeedback>
		);
		/*return (
			<TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
				<View style={{width:widthVar}}>
					<Input placeholder={placeholder} value={value} disabled={true}
						rightIcon={<Fontisto name="date" size={24} color="black"   
						onPress={()=>{setShowed(true);setType("date");}}/>}/>
					
					{showed&&<DateTimePicker
						  testID="datePicker"
						  value={new Date()}
						  mode={type}
						  is24Hour={true}
						  display="default"
						  onChange={type=="date"?dateAction:timeAction}
						  minimumDate={new Date()}
						/>}
				</View>
			</TouchableWithoutFeedback>
		);*/
}


export default PickerTime;