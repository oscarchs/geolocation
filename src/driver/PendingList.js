import React from 'react';
import { StyleSheet, Text, View, StatusBar,
    TextInput, TouchableOpacity,
    Image, ScrollView, RefreshControl, Picker, Alert} from 'react-native';
import { SearchBar, Button,Header,Card, ListItem, List } from 'react-native-elements';
import CustomMenuItem from '../CustomMenuItem';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomGeneralItem from '../CustomGeneralItem';
import AsyncStorage from '@react-native-community/async-storage';

class PendingList extends React.Component{
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
        this._getPendingList();
    };

    _showClientInMap = (item) => {
      this.props.navigation.navigate('TraceMap',{unique_client_data: item})
    };

    _getPendingList = () => {
      fetch('http://solucionesoggk.com/api/v1/pending_list', {
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

    _MarkAsDelivered = (item) =>{

      Alert.alert(
        'Confirmación',
        'La guía de remisión '+item.id_guia_remisionh+' será marcada como entregada, desea continuar?',
        [
          {text: 'OK', 
              onPress: () => {
                var update_form = new FormData();
                update_form.append('idgremisionh',item.id_guia_remisionh);
                this.setState({spinner:true});
                fetch('http://solucionesoggk.com/api/v1/update_gremisionh', {
                              method: 'POST',
                              headers: {
                                  'Content-Type': 'multipart/form-data',
                                  'Cache-Control': 'no-cache'
                              },
                              body:update_form,
                              }).then((response) => response.json()).then((res => {
                                  alert(res.message);
                              }));
                              this._getPendingList();
              } 
          },
          {
            text: 'Cancel',
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          }
        ],
        {cancelable: false},
      );
    }


    render(){
        return(
            <React.Fragment>
            <ScrollView> 
            <Spinner
                visible={this.state.spinner}
                textContent={'Cargando entregas pendientes...'}
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
                                id_guia_remisionh={item.id_guia_remisionh}                                      
                                key={item.id_guia_remisionh}
                                go_to_map={ () => this._goToMap(item) }
                                mark_as_delivered={ () => this._MarkAsDelivered(item) }
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
export default PendingList;