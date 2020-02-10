import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity} from 'react-native';
    import PropTypes from 'prop-types';
import {Card,Divider, Icon} from 'react-native-elements';

class CustomListItem extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <React.Fragment>
            <View style={styles.info}>
            <Text style={{color: '#517fa4',fontWeight: 'bold'}}>Razon Social: {this.props.razon_social}</Text>
            <Text style={{color: '#517fa4',fontWeight: 'bold'}}>Direccion: {this.props.direccion}</Text>
            <Text style={{color: '#517fa4',fontWeight: 'bold'}}>Tipo: {this.props.tipo_empresa}</Text>
            <Text style={{color: '#517fa4',fontWeight: 'bold'}}>Creado: {this.props.creacion}</Text>
            </View>

            <View style={styles.options}>
            <Icon name='edit' color='#517fa4' onPress={this.props.onPress}/>
            </View>
            
            <Divider/>
            </React.Fragment>
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
    options:{
      right:10,
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
  
  export default CustomListItem;
  