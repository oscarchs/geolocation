import React from 'react';
import { StyleSheet, Text, View, StatusBar,
    TextInput, TouchableOpacity,
    Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Header} from 'react-native-elements';


class AdminHome extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            current_user : '',
        };
        this.currentVersion = '0.1';
        this.updateAvailable = false;
        this._getCurrentUser();
        this._mustUpdate();
    }
    
    _getCurrentUser = async () =>{
        var current_user = await AsyncStorage.getItem('current_user');
        this.setState( {current_user: JSON.parse(current_user)});
    }

    _mustUpdate = async () =>{
    fetch('http://solucionesoggk.com/api/v1/appversion', {
        method: 'GET',
        headers: {
            'Content-Type': 'multipart/form-data',
        },
        }).then((response) => response.json()).then((res => {
            if (res.success === true){
                if(this.currentVersion != res.version){
                    this.updateAvailable = true;
                    alert("Update!");
                }
            }
        }));
    }

    
    componentDidMount = () =>{
        console.log(this.state.current_user);
        console.log("home");
    }
    render(){
        return(
            <React.Fragment>
                <Text>Opciones de administrador</Text>
           </React.Fragment>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    }
    
});
export default AdminHome;