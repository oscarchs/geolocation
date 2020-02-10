import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity} from 'react-native';
    import PropTypes from 'prop-types';
import {Card,Divider, Icon} from 'react-native-elements';

class CustomGeneralItem extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <React.Fragment>
            <View style={styles.info}>
            <TouchableOpacity>
            <Text style={{color: '#517fa4',fontWeight: 'bold'}}>Razon Social: {this.props.razon_social}</Text>
            { this.props.direccion && ( <Text style={{color: '#517fa4',fontWeight: 'bold'}}>Direccion: {this.props.direccion}</Text> ) }
            { this.props.contacto_nombre && ( <Text style={{color: '#517fa4',fontWeight: 'bold'}}>Nombre de contacto: {this.props.contacto_nombre}</Text> ) }
            { this.props.contacto_telefono && ( <Text style={{color: '#517fa4',fontWeight: 'bold'}}>Nombre de telefono: {this.props.contacto_telefono}</Text> ) }            
            { this.props.id_guia_remisionh && ( <Text style={{color: '#517fa4',fontWeight: 'bold'}}>Guia de remisión: {this.props.id_guia_remisionh}</Text> ) }
            { this.props.f_entrega && ( <Text style={{color: '#517fa4',fontWeight: 'bold'}}>Fecha de entrega: {this.props.f_entrega}</Text> ) }



            <View style={{flex: 1, flexDirection: 'row'}}>
            { this.props.go_to_map && 
              ( 
                <View style={{width: 100, height: 50, backgroundColor: 'powderblue'}}>
                <Icon name='google-maps' type='material-community' iconStyle={styles.buttonIcon} onPress={this.props.go_to_map}/> 
                 </View> 
              ) 
            }
            { this.props.mark_as_delivered && 
              ( 
                <View style={{width: 100, height: 50, backgroundColor: 'skyblue'}}>
                <Icon name='check' type='font-awesome' iconStyle={styles.buttonIcon} onPress={this.props.mark_as_delivered}/> 
                </View>
              ) 
            }
            </View>
            </TouchableOpacity>
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
    buttonIcon:{
      color:'#ffffff',
      fontSize:40,
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
  
  export default CustomGeneralItem;
  