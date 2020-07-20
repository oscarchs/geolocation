import React from 'react';
import { StyleSheet, Text, View, StatusBar,
    TextInput, TouchableOpacity,
    Image } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


class ClientProfile extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            current_user : '',
        };
        this._getCurrentUser();
    }
    _signOutAsync = async () => {
        await AsyncStorage.clear();
        await AsyncStorage.setItem('user_mail',this.state.current_user.ruc_dni);
        this.props.navigation.navigate('Auth');
      };

    _getCurrentUser = async () =>{
        var current_user = await AsyncStorage.getItem('current_user');
        this.setState( {current_user: JSON.parse(current_user)});
    }

    render(){

        return(
            <View style={styles.container}>
            <View style={styles.header}></View>
            <Image style={styles.avatar} source={{uri: 'https://bootdey.com/img/Content/avatar/avatar6.png'}}/>
            <View style={styles.body}>
              <View style={styles.bodyContent}>
                <Text style={styles.name}>{ this.state.current_user.razon_social }</Text>
                <Text style={styles.info}>{ this.state.current_user.ruc_dni }</Text>
                <TouchableOpacity style={styles.buttonContainer} onPress={this._signOutAsync}>
                  <Text style={styles.buttonText}>Cerrar Sesión</Text> 
                </TouchableOpacity>
              </View>
          </View>
        </View>

        );
    }
}



const styles = StyleSheet.create({
    header:{
      backgroundColor: "#0277bd",
      height:200,
    },
    avatar: {
      width: 130,
      height: 130,
      borderRadius: 63,
      borderWidth: 4,
      borderColor: "white",
      marginBottom:10,
      alignSelf:'center',
      position: 'absolute',
      marginTop:130
    },
    name:{
      fontSize:22,
      color:"#FFFFFF",
      fontWeight:'600',
    },
    body:{
      marginTop:40,
    },
    bodyContent: {
      flex: 1,
      alignItems: 'center',
      padding:30,
    },
    name:{
      fontSize:28,
      color: "#696969",
      fontWeight: "600"
    },
    info:{
      fontSize:16,
      color: "#00BFFF",
      marginTop:10
    },
    description:{
      fontSize:16,
      color: "#696969",
      marginTop:10,
      textAlign: 'center'
    },
    buttonContainer: {
      marginTop:10,
      height:45,
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom:20,
      width:250,
      backgroundColor: "#0277bd",
    },
    buttonText: {
        color: 'white',

    }
  });
export default ClientProfile;