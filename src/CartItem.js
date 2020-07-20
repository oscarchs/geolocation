import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity, TextInput} from 'react-native';
    import PropTypes from 'prop-types';
import {Card,Divider, Icon} from 'react-native-elements';

class CartItem extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <React.Fragment>
            <View style={styles.info}>
            
                <View style={{flex: 1, flexDirection: 'row',marginBottom:11}}>
                
                { this.props.quantity && 
                  ( 
                    <View style={{flex:1,width: 100, height: 20}}>
                        <TextInput keyboardType={"numeric"} style={{fontWeight: 'bold'}} value={this.props.quantity}/>
                     </View> 
                  ) 
                }
                { this.props.name && 
                  ( 
                    <View style={{flex:4,width: 100, height: 20}}>
                        <Text style={{fontWeight: 'bold'}}>{this.props.name}</Text>
                     </View> 
                  ) 
                }
                { this.props.remove && 
                  ( 
                    <View style={{flex:1,width: 100, height: 20, backgroundColor: 'white'}}>
                      <TouchableOpacity style={styles.item_chiki} onPress={this.props.remove}>
                        <Icon name='trash-o' type='font-awesome' iconStyle={styles.buttonIcon}/> 
                      </TouchableOpacity>
                    </View>
                  ) 
                }
                </View>
                
                <View style={{flex: 1, flexDirection: 'row', marginBottom:2}}>
                    <View style={{flex:2,width: 100, height: 20}}>
                        <Text style={{fontWeight: 'bold'}}>Cantidad</Text>
                     </View> 
                    <View style={{flex:2,width: 100, height: 20}}>
                        <Text style={{fontWeight: 'bold'}}>Precio Unitario</Text>
                     </View> 
                    <View style={{flex:2,width: 100, height: 20, backgroundColor: 'white'}}>
                        <Text style={{fontWeight: 'bold'}}>Precio Total</Text>
                    </View>
                </View>
                <View style={{flex: 4, flexDirection: 'row', marginBottom:25}}>
                    <View style={{flex:2,width: 100, height: 20}}>
                        <TextInput keyboardType={"numeric"} style={styles.inputBox} value={this.props.cantidad} onChangeText={ (text) => {this.props.on_quantity_change(text,this.props.name)}} editable={this.props.editable}/>
                     </View> 
                    <View style={{flex:2,width: 100, height: 20}}>
                        <TextInput keyboardType={"numeric"} style={styles.inputBox} value={this.props.precio_unit} onChangeText={ (text) => {this.props.on_unit_price_change(text,this.props.name)}} editable={this.props.editable}/>
                     </View> 
                    <View style={{flex:2,width: 100, height: 20, backgroundColor: 'white'}}>
                      <TouchableOpacity style={styles.item_chiki} onPress={this.props.remove}>
                        <TextInput keyboardType={"numeric"} style={styles.inputBox} value={this.props.precio_total}/>
                      </TouchableOpacity>
                    </View>
                </View>
                <Divider style={{ backgroundColor: 'skyblue', height:1}} />


            </View>
            
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
      color:'skyblue',
      fontSize:20,
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
      marginTop:10,
      flexDirection: 'column',
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

    },
    inputBox: {
        height: 40,
        borderColor: 'skyblue',
        borderWidth: 2,
        borderRadius: 5,
        paddingVertical: 10,
        color:'#424242',
        margin: 2,
        textAlign: 'center',
    },
  });
  
  export default CartItem;
  