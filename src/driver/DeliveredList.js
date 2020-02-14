import React from 'react';
import { StyleSheet, Text, View, StatusBar,
    TextInput, TouchableOpacity,
    Image, ScrollView, RefreshControl, Picker, Alert} from 'react-native';
import { SearchBar, Button,Header,Card, ListItem, List } from 'react-native-elements';
import CustomMenuItem from '../CustomMenuItem';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomGeneralItem from '../CustomGeneralItem';
import AsyncStorage from '@react-native-community/async-storage';

class DeliveredList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            current_user : '',
            pending_list: '',
            spinner: false,
            submitting: false,
        };
    }
    componentDidMount = async () => {
        this.setState({spinner: true});
        this._getDeliveredList();
    };

    _getCurrentUser = async () =>{
        var current_user = await AsyncStorage.getItem('current_user');
        return JSON.parse(current_user);
    };

    _showClientInMap = (item) => {
      this.props.navigation.navigate('TraceMap',{unique_client_data: item})
    };

    _getDeliveredList = () => {
      fetch('http://solucionesoggk.com/api/v1/delivered_list', {
        method: 'GET',
        headers: {
            'Content-Type': 'multipart/form-data',
            'Cache-Control': 'no-cache'
        },
        }).then((response) => response.json()).then((res => {
            this.setState({spinner: false});
            if (res.success == true){
              this.setState({pending_list:res.data})
            }
        }));
    };

    _goToMap = (item) => {
      this.setState({loading_locations: true});
        //get locations
        fetch('http://solucionesoggk.com/api/v1/client_locations?ruc_dni=' + item.ruc_dni, {
            method: 'GET',
            headers: {
            'Content-Type': 'multipart/form-data',
            'Cache-Control': 'no-cache'
            },
          }).then((response) => response.json()).then((res => {
            this.setState({loading_locations: false});
            if ( res.success === true){
              alert(res.message);
              this.props.navigation.navigate('TraceMapImproved', {client_list:res.data});
            }
            else{
              alert(res.message);
            }    
        }));
    };


    render(){
        return(
            <React.Fragment>
            <ScrollView> 
            <Spinner
                visible={this.state.spinner}
                textContent={'Cargando entregas realizadas...'}
                textStyle={styles.spinnerTextStyle}
            />

            <Spinner
                visible={this.state.submitting}
                textContent={'Enviando información...'}
                textStyle={styles.spinnerTextStyle}
            />

         <Card title="Entregas pendientes">
                {
                    this.state.pending_list ?
                    (
                        this.state.pending_list.map((item) => (
                             <ListItem
                                Component={CustomGeneralItem}
                                razon_social={item.razon_social}
                                f_entrega={item.f_entrega}
                                codigoNB={item.codigoNB}    
                                numero_pedido={item.numero_pedido}
                                numeracion={item.numeracion}
                                f_entregado={item.f_entregado}                             
                                key={item.id_guia_remisionh}
                                go_to_map={ () => this._goToMap(item) }
                                bottomDivider
                            />
                            ))
                    ) : (
                        <Text>No hay datos</Text>
                    )
                    
                }
            </Card>     
            </ScrollView>  

           </React.Fragment>

        );
    }
}



const styles = StyleSheet.create({
    header:{
      backgroundColor: "#0277bd",
      height:200,
    },
    spinnerTextStyle:{
        color: '#ffffff',
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
export default DeliveredList;