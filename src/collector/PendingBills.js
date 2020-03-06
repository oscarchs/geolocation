import React from 'react';
import { StyleSheet, Text, View, StatusBar,
    TextInput, TouchableOpacity,
    Image, ScrollView, RefreshControl, Picker, Alert} from 'react-native';
import { SearchBar, Button,Header,Card, ListItem, List } from 'react-native-elements';
import CustomMenuItem from '../CustomMenuItem';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomGeneralItem from '../CustomGeneralItem';
import AsyncStorage from '@react-native-community/async-storage';

class PendingBills extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            current_user : '',
            pending_bills: '',
            spinner: false,
            submitting: false,
            searching: false,
            searchKey: null,
            searchCriteria: 'razon_social',
            filtered_bills: null,
        };
    }
    componentDidMount = async () => {
        this.setState({spinner: true});
        this._getPendingBills();
    };

    _getCurrentUser = async () =>{
        var current_user = await AsyncStorage.getItem('current_user');
        return JSON.parse(current_user);
    };

    _showClientInMap = (item) => {
      this.props.navigation.navigate('TraceMap',{unique_client_data: item})
    };

    _getPendingBills = () => {
      fetch('https://solucionesoggk.com/api/v1/pending_bills', {
        method: 'GET',
        headers: {
            'Content-Type': 'multipart/form-data',
            'Cache-Control': 'no-cache'
        },
        }).then((response) => response.json()).then((res => {
            this.setState({spinner: false});
            if (res.success == true){
              this.setState({pending_bills:res.data})
            }
        }));
    };

    _addPayment = (item) => {
        let payment_item = {
          'idcajah': item.idcajah,
          'total': item.total,
          'pagos_recibidos': item.pagos_recibidos ? (item.pagos_recibidos) : (0),
          'por_pagar': item.pagos_recibidos ? (item.total - item.pagos_recibidos) : item.total,
        }
        console.log(payment_item);
        this.props.navigation.navigate('PaymentForm', {payment_data:payment_item});
    };

    _goToMap = (item) => {
      this.setState({loading_locations: true});
        //get locations
        fetch('https://solucionesoggk.com/api/v1/client_locations?ruc_dni=' + item.ruc_dni, {
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
    _filterPendingBillsList = (text) => {
      console.log(text);
      this.setState({searchKey: text});
      this.setState({searching:true});
        if(this.state.pending_bills){
            var result = [];
            if(this.state.searchCriteria == 'razon_social'){
              result = this.state.pending_bills.filter( bill => bill.razon_social.includes(text.toUpperCase()) );
            }
            else if(this.state.searchCriteria == 'nro_pedido'){
              result = this.state.pending_bills.filter( bill => bill.codigoNB.includes(text.toUpperCase()) );
            }
            this.setState({filtered_bills: result})
        }
      this.setState({searching:false});
    };

    render(){
        return(
            <React.Fragment>

             <SearchBar lightTheme round keyboardType={'default'}
                placeholder= {'Búsqueda de facturas pendientes'}
                onChangeText={ (text) => this._filterPendingBillsList(text)}
                value={this.state.searchKey}
                autoCapitalize={"characters"}

              />
            <Picker
                selectedValue={this.state.searchCriteria}
                style={{height: 50}}
                onValueChange={ itemValue => {this.setState({searchCriteria: itemValue})}}>
                <Picker.Item label="Número de pedido" value="nro_pedido" />
                <Picker.Item label="Razón social" value="razon_social" />
            </Picker>
            <ScrollView> 
            <Spinner
                visible={this.state.spinner}
                textContent={'Cargando facturas pendientes...'}
                textStyle={styles.spinnerTextStyle}
            />

            <Spinner
                visible={this.state.submitting}
                textContent={'Enviando información...'}
                textStyle={styles.spinnerTextStyle}
            />
            <Spinner
                visible={this.state.searching}
                textContent={'Buscando...'}
                textStyle={styles.spinnerTextStyle}
            />

         <Card title="Facturas pendientes">
                {
                    this.state.filtered_bills ?
                    (
                        this.state.filtered_bills.map((item) => (
                             <ListItem
                                Component={CustomGeneralItem}
                                razon_social={item.razon_social}
                                ruc_dni={item.ruc_dni}
                                codigoNB={item.codigoNB}
                                pago_total={item.total}
                                pago_recibido={item.pagos_recibidos}                        
                                f_cobro={item.f_cobro}     
                                key={item.idcajah}
                                go_to_map={ () => this._goToMap(item) }
                                add_payment={ () => this._addPayment(item) }
                                bottomDivider
                            />
                            ))
                    ) : (
                        this.state.pending_bills ?
                                        (
                                        this.state.pending_bills.map((item) => (
                                             <ListItem
                                                Component={CustomGeneralItem}
                                                razon_social={item.razon_social}
                                                ruc_dni={item.ruc_dni}
                                                codigoNB={item.codigoNB}
                                                pago_total={item.total}
                                                pago_recibido={item.pagos_recibidos}                        
                                                f_cobro={item.f_cobro}     
                                                key={item.idcajah}
                                                go_to_map={ () => this._goToMap(item) }
                                                add_payment={ () => this._addPayment(item) }
                                                bottomDivider
                                            />
                                            ))
                                    ) : (
                                        <Text>No hay datos</Text>
                                    )

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
export default PendingBills;