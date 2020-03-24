import React from 'react';
import { StyleSheet, Text, View, StatusBar,
    TextInput, TouchableOpacity,
    Image, ScrollView, KeyboardAvoidingView, Picker, Alert} from 'react-native';
    import { Header,Card,Divider } from 'react-native-elements';
    import t from 'tcomb-form-native';
import Spinner from 'react-native-loading-spinner-overlay';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import moment from 'moment';
var Form = t.form.Form;


class OrderForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            current_user: '',
            form_state: '',
            current_position: {
                latitude: '',
                longitude: '',
            },
            selected_client: '',
            orderFormOptions: {
                fields: {
                    f_entrega:{
                        label: 'Fecha de entrega',
                        mode: 'date',
                        placeholder: 'Seleccione una fecha de entrega',
                        config:{
                              format: (date) => {
                                 return moment(date).format('YYYY-MM-DD');
                                },
                        }
                    },
                    f_cobro:{
                        label: 'Fecha de cobro',
                        mode: 'date',
                        placeholder: 'Seleccione una fecha de cobro',
                         config:{
                              format: (date) => {
                                 return moment(date).format('YYYY-MM-DD');
                                },
                        }
                    },
                    codigoNB:{
                        label: 'codigoNB (orden de venta)',
                        placeholder: 'Orden de venta',
                    },
                }
            },
            spinner: false,
            submmiting: false,
            clientList: [],
            clientListNoRuc: [],
            clientListBrokenLocation: [],
            clients_options: [],
            selected_products:[],
            totals:'',
        };
        this.selected_id;
        this.selected_id_type;
        this.orderFormTwo = new FormData();
        this._getCurrentUser();
    }


    componentDidMount = () =>{
        //this._currentPositionNavigator();
        this.getClientList();
        this.selected_products = this.props.navigation.getParam('selected_products','no_data');
        this.totals = this.props.navigation.getParam('totals','no_data');

        this.setState({selected_products: this.props.navigation.getParam('selected_products',null)});
        this.setState({totals: this.props.navigation.getParam('totals',null)});


    }


    _getCurrentUser = async () =>{
        var current_user = await AsyncStorage.getItem('current_user');
        this.setState({current_user : JSON.parse(current_user)});
    }

    formChanged = (value) => {
        this.setState({form_state:value});
        console.log(value);
    }

    getClientList = () => {
        fetch('http://192.168.1.33/~oscar/oggk-restserver/index.php/v1/clients_resumed', {
            method: 'GET',
            headers: {
                    'Content-Type': 'multipart/form-data',
                    'Cache-Control': 'no-cache',
                },
            }).then((response) => response.json()).then(res => {
                var new_list = {
                                    name:'CLIENTES ('+res.length+')',
                                    id: 0,
                                    children: Array.from( res, item => {
                                                                    let dict = {};
                                                                    dict['id'] = item.idcliente;
                                                                    dict['name'] = item.razon_social + " (" +(item.ruc_dni)+ ")";
                                                                    return dict;      
                                                                        } ),

                                }
                //res.map( item => console.log(item));
                this.setState({  clients_options: [...this.state.clients_options, new_list]});
                this.setState({clientList:res});
            });
    }

    onSubmit = (id) => {
        let valid_form = this.orderform.getValue();
        if( !this.state.selected_client){
            console.log(this.state.selected_client);
            alert("Debe seleccionar un cliente para generar una orden de venta");
            return;
        }
        if(!valid_form){
            alert("Los campos de rojo son obligatorios");
            return;
        }
        else{
            this.setState({submmiting: true});
            this.orderFormTwo.append('idcliente',this.state.selected_client.id);
            this.orderFormTwo.append('idvendedor',this.state.current_user.id);
            this.orderFormTwo.append('subtotal',this.state.totals.sub_total);
            this.orderFormTwo.append('total',this.state.totals.total);
            this.orderFormTwo.append('igv',this.state.totals.igv);
            for(var key in valid_form){
                    if( key == 'f_entrega' || key=='f_cobro'){
                        this.orderFormTwo.append(key,moment(valid_form[key]).format('YYYY-MM-DD'));
                    }
                    else{
                        this.orderFormTwo.append(key,valid_form[key]);
                    }    
                }
            this.orderFormTwo.append('idusuario',id);
            fetch('http://192.168.1.33/~oscar/oggk-restserver/index.php/v1/add_sale_order', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: this.orderFormTwo,
                    }).then((response) => response.json()).then((res => {
                        alert(res.message);
                        console.log(res.data);
                        fetch('http://192.168.1.33/~oscar/oggk-restserver/index.php/v1/id_orden_ventah?numeracion='+res.data.numeracion, {
                                    method: 'GET',
                                    headers: {
                                        'Content-Type': 'multipart/form-data',
                                        'Cache-Control': 'no-cache'
                                    },
                                    }).then((response) => response.json()).then((res => {
                                        if (res.success === true){
                                            this.state.selected_products.map( (item) => {
                                                var detail_form = new FormData();
                                                detail_form.append('id_orden_ventah',res.data.id_orden_ventah);
                                                for (var [key, value] of Object.entries(item)){
                                                    if( key !== 'nombre'){
                                                        detail_form.append(key,value);
                                                    }
                                                }
                                                fetch('http://192.168.1.33/~oscar/oggk-restserver/index.php/v1/add_sale_order_detail', {
                                                        method: 'POST',
                                                        headers: {
                                                            'Content-Type': 'multipart/form-data',
                                                            'Cache-Control': 'no-cache',
                                                        },
                                                        body: detail_form,
                                                });
                                                console.log(detail_form);
                                            })
                                            this.setState({submmiting: false});
                                            console.log(res.data);
                                        }
                                    }));
                                    this.orderFormTwo = new FormData();
                                    this.props.navigation.navigate('OrdersList');

            }));

            console.log(this.orderFormTwo);
        }
    }

    render(){
        let visit_subject = t.enums({
            primera_visita: 'Primera Visita',
            visita:'Visita regular',
            pedido: 'Pedido',
            cobraza: 'Cobranza',
            entrega: 'Entrega de pedido'
        })

        let type_moneda = t.enums({
            1: 'Soles',
            2:'Dólares',
            3: 'Euros',
        })
    
        let Sale = t.struct({
            f_entrega: t.Date,
            f_cobro: t.Date,
            codigoNB: t.Number,
            moneda: type_moneda,
        })

        return(
            <React.Fragment>
                <KeyboardAvoidingView behavior='padding'>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Obteniendo ubicación actual...'}
                    textStyle={styles.spinnerTextStyle}
                    />
                <Spinner
                    visible={this.state.submmiting}
                    textContent={'Guardando Visita...'}
                    textStyle={styles.spinnerTextStyle}
                    />

                <ScrollView>
                
                <Card title={'Orden de venta'}>

                        <SectionedMultiSelect
                        single
                        hideConfirm
                        items={this.state.clients_options}
                        uniqueKey="name"
                        subKey="children"
                        expandDropDowns
                        searchPlaceholderText="Búsqueda de clientes"
                        selectText={this.state.selected_client.name || "Clientes"}
                        showDropDowns={true}
                        expandDropDowns = {false}
                        readOnlyHeadings={true}
                        onSelectedItemsChange={ selected => {} }
                        onSelectedItemObjectsChange={ (selected) => this.setState({selected_client:selected[0]}) }
                        styles = {styles.map_options}
                        />

                     <Form ref={orderinfo => this.orderform = orderinfo} type={Sale} options={this.state.orderFormOptions} onChange={this.formChanged} value={this.state.form_state}/>

                </Card> 
                <Card title='Productos seleccionados'>
                    {
                        this.state.selected_products ?
                        (
                            this.state.selected_products.map( (item) =>
                                (
                                <View style={{flex: 1, flexDirection: 'row', marginBottom:5, marginTop:5}}>
                                <View style={{flex:0.5,width: 100, height: 20}}>
                                    <Text style={{fontWeight: 'bold', fontStyle:'italic', color:'grey'}}>{item.cantidad}</Text>
                                 </View> 
                                <View style={{flex:4.5,width: 100, height: 20}}>
                                    <Text style={{fontWeight: 'bold',fontStyle:'italic', color:'grey'}}>{item.nombre}</Text>
                                 </View> 
                                <View style={{flex:1,width: 100, height: 20, backgroundColor: 'white'}}>
                                    <Text style={{fontWeight: 'bold', fontStyle:'italic', color:'grey'}}>{item.precio_total}</Text>
                                </View>
                                </View>                            
                            ))
                             
                        ):(
                            <Text>Hubo un error, no figura ningun producto seleccionado</Text>
                        ) 
                    }
                                <Divider style={{ backgroundColor: 'grey', height:1, marginTop:10}} />
                                <View style={{flex: 1, flexDirection: 'row', marginBottom:5, marginTop:5}}>
                                <View style={{flex:2,width: 100, height: 20}}>
                                    <Text style={{fontWeight: 'bold', fontStyle:'italic', color:'grey'}}>Sub total</Text>
                                 </View> 
                                <View style={{flex:2,width: 100, height: 20}}>
                                    <Text style={{fontWeight: 'bold',fontStyle:'italic', color:'grey'}}>IGV</Text>
                                 </View> 
                                <View style={{flex:2,width: 100, height: 20, backgroundColor: 'white'}}>
                                    <Text style={{fontWeight: 'bold', fontStyle:'italic', color:'grey'}}>Total</Text>
                                </View>
                                </View>

                                 <View style={{flex: 1, flexDirection: 'row', marginBottom:5, marginTop:5}}>
                                <View style={{flex:2,width: 100, height: 20}}>
                                    <Text style={{fontWeight: 'bold', fontStyle:'italic', color:'grey'}}>{this.state.totals.sub_total}</Text>
                                 </View> 
                                <View style={{flex:2,width: 100, height: 20}}>
                                    <Text style={{fontWeight: 'bold',fontStyle:'italic', color:'grey'}}>{this.state.totals.igv}</Text>
                                 </View> 
                                <View style={{flex:2,width: 100, height: 20, backgroundColor: 'white'}}>
                                    <Text style={{fontWeight: 'bold', fontStyle:'italic', color:'grey'}}>{this.state.totals.total}</Text>
                                </View>
                                </View>  
                </Card>

                    <TouchableOpacity style={styles.buttonStyle} onPress={() => this.onSubmit(this.state.current_user.id)}> 
                        <Text style={styles.textButton}>Guardar visita</Text>
                    </TouchableOpacity>

                </ScrollView>  
            </KeyboardAvoidingView>
             </React.Fragment>
            

        );
    }
}

const styles = StyleSheet.create({
    container_avoid_tab:{
        marginBottom:100,
    },
    spinnerTextStyle:{
        color: '#ffffff',
    },  
    container: {
      flexGrow: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 100,
    },
    title: {
        color: 'white',
        fontSize: 20,
    },
    inputBox: {
        width: 250,
        borderBottomColor: '#757575',
        borderBottomWidth: 2,
        paddingVertical: 10,
        color:'#424242',
        margin: 5,
        textAlign: 'center',
    },
    textButton: {
        fontSize: 16,
        fontWeight: '500',
        color:'#ffffff',
        textAlign: 'center',
    },
    select:{
        alignItems: 'center',
        justifyContent: 'center',
        width:250,
    },
    buttonStyle: {
        margin: 20,
        backgroundColor: '#0277bd',
        width:250,
        paddingVertical: 10,
    },
    map_options:{
        color: 'black',
    },
});
export default OrderForm;