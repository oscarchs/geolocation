import React from 'react';
import { StyleSheet, Text, View,TouchableOpacity} from 'react-native';
    import PropTypes from 'prop-types';
import {Card,Divider, Icon} from 'react-native-elements';

class CustomMenuItem extends React.Component{
    constructor(props){
        super(props);
    }

    render(){
        return(
            <React.Fragment>
            <TouchableOpacity style={ (this.props.type == 'chiqui') ? (styles.item_chiki):(styles.item)} onPress={this.props.onPress}>
                <Text style={styles.header}>{this.props.menu_item}</Text>
            </TouchableOpacity>

            </React.Fragment>
        );
    }
}


const styles = StyleSheet.create({
    header:{
      color: '#517fa4',
      fontWeight: 'bold',
      textAlign: 'center',
    },
    item:{
      borderRadius: 20,
      borderWidth: 1,
      borderColor: '#517fa4',   
      padding: 20,
      margin: 10,
    }, 
    item_chiki:{
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#517fa4',   
        padding: 20,
        margin: 10,
        height: 60,
        width:200,
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
  
  export default CustomMenuItem;
  