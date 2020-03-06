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
            { this.props.ruc_dni && ( <Text style={{color: '#517fa4',fontWeight: 'bold'}}>RUC/DNI: {this.props.ruc_dni}</Text> ) }
            { this.props.pago_total && ( <Text style={{color: '#517fa4',fontWeight: 'bold'}}>Total: {this.props.pago_total}</Text> ) }
            { this.props.pago_recibido && ( <Text style={{color: '#517fa4',fontWeight: 'bold'}}>Recibido: {this.props.pago_recibido}</Text> ) }
            { this.props.contacto_nombre && ( <Text style={{color: '#517fa4',fontWeight: 'bold'}}>Nombre de contacto: {this.props.contacto_nombre}</Text> ) }
            { this.props.contacto_telefono && ( <Text style={{color: '#517fa4',fontWeight: 'bold'}}>Nombre de telefono: {this.props.contacto_telefono}</Text> ) }            
            { this.props.codigoNB && ( <Text style={{color: '#517fa4',fontWeight: 'bold'}}>CódigoNB: {this.props.codigoNB}</Text> ) }
            { this.props.numero_pedido && ( <Text style={{color: '#517fa4',fontWeight: 'bold'}}>Número de pedido: {this.props.numero_pedido}</Text> ) }
            { this.props.numeracion && ( <Text style={{color: '#517fa4',fontWeight: 'bold'}}>Guia de remision: {this.props.numeracion}</Text> ) }
            { this.props.f_entrega && ( <Text style={{color: '#517fa4',fontWeight: 'bold'}}>Fecha de entrega: {this.props.f_entrega}</Text> ) }
            { this.props.f_entregado && ( <Text style={{color: '#517fa4',fontWeight: 'bold'}}>Fecha de entregado: {this.props.f_entregado}</Text> ) }
            { this.props.f_cobro && ( <Text style={{color: '#517fa4',fontWeight: 'bold'}}>Fecha de cobro: {this.props.f_cobro}</Text> ) }


            <View style={{flex: 1, flexDirection: 'row'}}>
            { this.props.go_to_map && 
              ( 
                <View style={{width: 100, height: 50, backgroundColor: 'powderblue'}}>
                  <TouchableOpacity style={styles.item_chiki} onPress={this.props.go_to_map}>
                    <Icon name='google-maps' type='material-community' iconStyle={styles.buttonIcon}/> 
                  </TouchableOpacity>
                 </View> 
              ) 
            }
            { this.props.mark_as_delivered && 
              ( 
                <View style={{width: 100, height: 50, backgroundColor: 'skyblue'}}>
                  <TouchableOpacity style={styles.item_chiki} onPress={this.props.mark_as_delivered}>
                    <Icon name='check' type='font-awesome' iconStyle={styles.buttonIcon}/> 
                  </TouchableOpacity>
                </View>
              ) 
            }
            { this.props.add_payment && 
              ( 
                <View style={{width: 100, height: 50, backgroundColor: 'skyblue'}}>
                  <TouchableOpacity style={styles.item_chiki} onPress={this.props.add_payment}>
                    <Icon name='money' type='font-awesome' iconStyle={styles.buttonIcon}/> 
                  </TouchableOpacity>
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
  