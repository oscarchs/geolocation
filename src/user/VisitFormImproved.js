import React from 'react';
import { StyleSheet, Text, View, StatusBar,
    TextInput, TouchableOpacity,
    Image, ScrollView, KeyboardAvoidingView, Picker, Alert} from 'react-native';
    import { Header,Card } from 'react-native-elements';
    import t from 'tcomb-form-native';
import Spinner from 'react-native-loading-spinner-overlay';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';

var Form = t.form.Form;


class VisitFormImproved extends React.Component{
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
            formVisitOptions: {
                fields: {
                    motivo:{
                        label: 'Motivo de la visita',
                    },
                    orden_venta:{
                        label: 'Número de orden de venta',
                        placeholder: 'Orden de venta',
                        hidden: true,
                    },
                    refinar: {
                        label: 'Refinar ubicación del cliente',
                        onChange: (bool) => console.log(bool),
                    }
                }
            },
            spinner: false,
            submmiting: false,
            clientList: [],
            clientListNoRuc: [],
            clientListBrokenLocation: [],
            clients_options: [],
        };
        this.selected_id;
        this.selected_id_type;
        this.visitFormTwo = new FormData();
        this._getCurrentUser();
    }


    componentDidMount = () =>{
        this._currentPositionNavigator();
    }


    _getCurrentUser = async () =>{
        var current_user = await AsyncStorage.getItem('current_user');
        this.setState({current_user : JSON.parse(current_user)});
    }

    _currentPositionNavigator = async () =>{
        let locationOptions = {
            enableHighAccuracy : true,
            timeout : 20000,
            maximumAge : 60 * 60 * 24
        }
        this.setState({spinner: true});
        Geolocation.getCurrentPosition(this.currentPositionSuccess,this.currentPositionError,locationOptions);
    }
    formChanged = (value) => {
        if (value.motivo == 'pedido'){
            var updateOptions = t.update(this.state.formVisitOptions, {
                        fields: {
                            orden_venta: {
                                hidden: {'$set': false}
                            }
                        }
                    });
        }
        else{
            var updateOptions = t.update(this.state.formVisitOptions, {
                fields: {
                    orden_venta: {
                        hidden: {'$set': true},
                    }
                }
            });
            delete value.orden_venta;
        }
       
        this.setState({form_state:value, formVisitOptions: updateOptions});
        console.log(value);
    }
    currentPositionSuccess = (position) => {
        {/* get near clients*/}
        console.log(position);
        let latlong = new FormData();
        latlong.append('latitude',position.coords.latitude);
        latlong.append('longitude',position.coords.longitude);
        this.setState({ current_position: { 
                                            latitude: position.coords.latitude,
                                            longitude: position.coords.longitude,
                                            }
                        }
                    );
        fetch('https://solucionesoggk.com/api/v1/near_clients', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Cache-Control': 'no-cache',
            },
            body: latlong,
            }).then((response) => response.json()).then(res => {
                var new_list = {
                                    name:'RUC ('+res.length+')',
                                    id: 0,
                                    children: Array.from( res, item => {
                                                                    let dict = {};
                                                                    dict['id'] = item.idcliubic;
                                                                    dict['name'] = item.razon_social + " (" +(item.sucursal_direccion || item.direccion)+ ")";
                                                                    dict['type'] = 'idcliubic';
                                                                    return dict;      
                                                                        } ),

                                }
                res.map( item => console.log(item));
                this.setState({  clients_options: [...this.state.clients_options, new_list]});
                this.setState({clientList:res});
            });


        fetch('https://solucionesoggk.com/api/v1/near_clients_no_ruc', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Cache-Control': 'no-cache'
            },
            body: latlong,
            }).then((response) => response.json()).then(res => {
                var new_list = {
                                    name:'NO RUC ('+res.length+')',
                                    id: 1,
                                    children: Array.from( res, item => {
                                                                    let dict = {};
                                                                    dict['id'] = item.id_cliente_no_ruc;
                                                                    dict['name'] = item.razon_social + " ("+ item.direccion + ")";
                                                                    dict['type'] = 'id_cliente_no_ruc';
                                                                    return dict;      
                                                                        } ),

                                }
                res.map( item => console.log(item));
                this.setState({  clients_options: [...this.state.clients_options, new_list]});
                this.setState({clientListNoRuc:res});
            });


        fetch('https://solucionesoggk.com/api/v1/near_clients_broken_location', {
            method: 'POST',
            headers: {
                'Cache-Control': 'no-cache'
                    },
            }).then((response) => response.json()).then(res => {
                var new_list = {
                                    name:'REFINAR UBICACION ('+res.length+')',
                                    id: 2,
                                    children: Array.from( res, item => {
                                                                    let dict = {};
                                                                    dict['id'] = item.idcliubic;
                                                                    dict['name'] = item.razon_social + " (" +(item.sucursal_direccion || item.direccion)+ ")";
                                                                    dict['type'] = 'idcliubic';
                                                                    return dict;      
                                                                        } ),

                                }
                res.map( item => console.log(item));
                this.setState({  clients_options: [...this.state.clients_options, new_list]});
                this.setState({clientListBrokenLocation:res});
            });
        this.setState({spinner: false});
    }

    currentPositionError = (err) => {
        console.log(err);
        this.setState({error : err.message});
        this.setState({spinner: false});
        alert("No se pudo obtener la ubicación, verifique el estado del GPS de su dispositivo e intente de nuevo por favor");
    }

    onSubmit = (id) => {
        let valid_form = this.visitform.getValue();
        if( !this.state.selected_client){
            console.log(this.state.selected_client);
            alert("Debe seleccionar un cliente para generar una visita");
            return;
        }
        if(!valid_form){
            alert("Los campos de rojo son obligatorios");
            return;
        }
        else{
            this.setState({submmiting: true});
            this.visitFormTwo.append('id',this.state.selected_client.id);
            this.visitFormTwo.append('type',this.state.selected_client.type);
            for(var key in valid_form){
                    if( key != 'refinar'){
                        this.visitFormTwo.append(key,valid_form[key]);
                    }    
                }
            this.visitFormTwo.append('idusuario',id);
            console.log(this.visitFormTwo);
            // here is executed the post operation with a new endpoint (improved to insert a dinamic visit based on the client type)
            fetch('https://solucionesoggk.com/api/v1/add_visit_improved', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: this.visitFormTwo,
                    }).then((response) => response.json()).then((res => {
                        alert(res.message);
                        this.setState({submmiting: false});
            }));
            if(valid_form.refinar == true){
                    location_info = new FormData();
                    location_info.append('latitude', this.state.current_position.latitude);
                    location_info.append('longitude', this.state.current_position.longitude);
                    location_info.append('id', this.state.selected_client.id);
                    location_info.append('type', this.state.selected_client.type)
                    console.log(location_info);
                    fetch('https://solucionesoggk.com/api/v1/update_client_location', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: location_info,
                    }).then((response) => response.json()).then((res => {
                        alert(res.message);
                        this.setState({submmiting: false});

                    }));
            }
        }
        this.visitFormTwo = new FormData();
        this.props.navigation.pop();
    }

    render(){
        let visit_subject = t.enums({
            primera_visita: 'Primera Visita',
            visita:'Visita',
            pedido: 'Pedido',
        })
    
        let Visit = t.struct({
            motivo: visit_subject,
            orden_venta: t.maybe(t.Number),
            refinar: t.Boolean,
        })

        return(
            <React.Fragment>
                <KeyboardAvoidingView behavior='padding'>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Obteniendo clientes cercanos...'}
                    textStyle={styles.spinnerTextStyle}
                    />
                <Spinner
                    visible={this.state.submmiting}
                    textContent={'Guardando Visita...'}
                    textStyle={styles.spinnerTextStyle}
                    />

                <ScrollView>

                <Card>

                        <SectionedMultiSelect
                        single
                        hideConfirm
                        items={this.state.clients_options}
                        uniqueKey="name"
                        subKey="children"
                        expandDropDowns
                        searchPlaceholderText="Búsqueda de clientes cercanos"
                        selectText={this.state.selected_client.name || "Clientes Cercanos (RUC/NO RUC)"}
                        showDropDowns={true}
                        expandDropDowns = {false}
                        readOnlyHeadings={true}
                        onSelectedItemsChange={ selected => {} }
                        onSelectedItemObjectsChange={ (selected) => this.setState({selected_client:selected[0]}) }
                        styles = {styles.map_options}
                        />

                     <Form ref={visitinfo => this.visitform = visitinfo} type={Visit} options={this.state.formVisitOptions} onChange={this.formChanged} value={this.state.form_state}/>

                     <TouchableOpacity style={styles.buttonStyle} onPress={() => this.onSubmit(this.state.current_user.id)}> 
                        <Text style={styles.textButton}>Guardar visita</Text>
                    </TouchableOpacity>
                  
                </Card>     
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
export default VisitFormImproved;