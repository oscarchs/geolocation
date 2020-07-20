import React from 'react';
import { StyleSheet, Text, View, StatusBar,
    TextInput, TouchableOpacity,
    Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { createDrawerNavigator,createAppContainer } from 'react-navigation';
import {Header, ListItem} from 'react-native-elements';
import CustomMenuItem from '../CustomMenuItem';
import CustomListItem from '../CustomListItem';
import LocationService from '../location/LocationService';


class ClientHome extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            current_user : '',
            spinner: false,

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
    fetch('https://solucionesoggk.com/api/v1/appversion', {
        method: 'GET',
        headers: {
            'Content-Type': 'multipart/form-data',
            'Cache-Control': 'no-cache'
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
        //let location_service = new LocationService();
        //location_service._startBackgroundService();
        //console.log("home");
    }
    render(){
        return(
            <React.Fragment>
           {/*<ClientForm /> */}
           {/*<BackgroundLocationExample/> */}

           <View>
          <ListItem
                    Component={CustomMenuItem}
                    menu_item={"NUEVO PEDIDO"}
                    onPress={ () => this.props.navigation.navigate('ClientProductsForm')}
          />

            </View>
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
    },
    spinnerTextStyle:{
        color: '#ffffff',
    },  
    
});
export default ClientHome;