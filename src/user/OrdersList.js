import React from 'react';
import { StyleSheet, Text, View, StatusBar,
    TextInput, TouchableOpacity,
    Image, ScrollView, RefreshControl, Picker, Alert} from 'react-native';
import { SearchBar, Button,Header,Card, ListItem, List } from 'react-native-elements';
import CustomMenuItem from '../CustomMenuItem';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomGeneralItem from '../CustomGeneralItem';
import AsyncStorage from '@react-native-community/async-storage';

class OrderList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            current_user : '',
            orders_list: '',
            spinner: false,
            submitting: false,
        };
    }
    componentDidMount = async () => {
        this.setState({spinner: true});
        this._getCurrentUser().then( this._getOrdersList() );
    };

    _getCurrentUser = async () =>{
        var current_user = await AsyncStorage.getItem('current_user');
        this.setState({current_user : JSON.parse(current_user)});
    };

    _getOrdersList = () => {
      fetch('http://192.168.1.33/~oscar/oggk-restserver/index.php/v1/user_sale_orders?user_id=29', {
        method: 'GET',
        headers: {
            'Content-Type': 'multipart/form-data',
            'Cache-Control': 'no-cache'
        },
        }).then((response) => response.json()).then((res => {
            this.setState({spinner: false});
            if (res.success == true){
              this.setState({orders_list:res.data})
            }
        }));
    };

    _makeNullable = (item) => {
      //making nullable order

      Alert.alert(
        'Confirmación',
        'La orden de venta '+item.codigoNB+' será anulada, desea continuar?',
        [
          {text: 'OK', 
              onPress: () => {
                  var update_form = new FormData();
                  update_form.append('id_orden_ventah',item.id_orden_ventah);
                  update_form.append('estado_doc',2);
                  fetch('http://192.168.1.33/~oscar/oggk-restserver/index.php/v1/update_order', {
                        method: 'POST',
                        headers: {
                                'Content-Type': 'multipart/form-data',
                                'Cache-Control': 'no-cache'
                        },
                        body:update_form,
                    }).then((response) => response.json()).then((res => {
                       alert(res.message);
                  }));
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
    };

    render(){
        return(
            <React.Fragment>
            <ScrollView> 
            <Spinner
                visible={this.state.spinner}
                textContent={'Cargando órdenes de venta...'}
                textStyle={styles.spinnerTextStyle}
            />

            <Spinner
                visible={this.state.submitting}
                textContent={'Enviando información...'}
                textStyle={styles.spinnerTextStyle}
            />
          <ListItem
                    Component={CustomMenuItem}
                    menu_item={"Crear orden de venta"}
                    onPress={ () => this.props.navigation.navigate('ProductsForm')}
                    type={'chiqui'}
          />

         <Card title="Ordenes de venta">
                {
                    this.state.orders_list ?
                    (
                        this.state.orders_list.map((item) => (
                             <ListItem
                                Component={CustomGeneralItem}
                                correlativo={item.id_orden_ventah}
                                razon_social={item.razon_social}
                                codigoNB={item.codigoNB}
                                f_emision={item.created_at}
                                total={item.total}  
                                f_entrega={item.f_entrega}
                                f_cobro={item.f_cobro}
                                estado_doc={item.estado_doc}
                                make_null={ () => this._makeNullable(item) }
                                key={item.id_orden_ventah}
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
export default OrderList;