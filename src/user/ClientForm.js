import React from 'react';
import { StyleSheet, Text, View, StatusBar,
    TextInput, TouchableOpacity,
    Image, ScrollView, KeyboardAvoidingView, Picker, Alert} from 'react-native';
    import { Header,Card } from 'react-native-elements';
import t from 'tcomb-form-native';
import Spinner from 'react-native-loading-spinner-overlay';
import Geolocation from 'react-native-geolocation-service';
import AsyncStorage from '@react-native-community/async-storage';

var Form = t.form.Form;

var location_types = t.enums({
    unica: 'Unica',
    fiscal: 'Fiscal',
    almacen: 'Almacén',
    cobranza: 'Cobranza',
})


class ClientForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            current_user: '',
            spinner: false,
            validating_rucdni: false,
            tipo_empresa: [],
            form_state: '',
            distrito: [],
            district_value: props.navigation.state.district_value,
            district_help: '',
            useShortForm: false,
            shouldUpdateForm: true,
            itsAClientUpdate: false,
            prevFormData:'',
            formClientOptions: {
                fields: {
                    no_data:{
                        label: 'Crear cliente sin RUC',
                        onChange: (bool) => console.log(bool),
                        hidden: true,
                    },
                    ruc_dni:{
                        label: 'RUC o DNI',
                        placeholder: 'RUC o DNI del cliente',
                        onEndEditing: (event) => this._checkClient(event.nativeEvent.text),
                        disabled: false,
                    },
                    razon_social:{
                        label: 'Razón Social',
                        placeholder: 'Razón social o nombre del cliente',
                        autoCapitalize: 'characters',
                    },
                    nombre_comercial:{
                        label: 'Nombre Comercial',
                        placeholder: 'Nombre comercial',
                        autoCapitalize: 'characters',
                    },
                    contacto_nombre: {
                        label: 'Nombre de contacto',
                        placeholder: 'Nombre completo de contacto',
                        autoCapitalize: 'characters',
                    },
                    contacto_telefono: {
                        label: 'Teléfono de contacto',
                        placeholder: 'Teléfono de contacto'
                    },
                    contacto_email: {
                        label: 'Email de contacto',
                        placeholder: 'Email de contacto',
                        autoCapitalize: 'characters',
                    },
                    distrito: {
                        placeholder: 'Nombre del distrito',
                        autoCapitalize: 'characters',
                        onChange: (event) => this._filterDistrict(event.nativeEvent.text),
                    },
                    direccion: {
                        label: 'Dirección del cliente',
                        placeholder: 'Avenida, Calle, Pasaje',
                        autoCapitalize: 'characters',
                    },
                    dias_credito: {
                        label: 'Días de crédito',
                        placeholder: 'Días de crédito permitidos'
                    },
                    tipo_pago: {
                        label: 'Tipo de pago',
                    },
                    location_type: {
                        label: 'Tipo de ubicación',
                        value: location_types.unica,
                    },
                    use_current_location: {
                        label: 'Usar mi ubicación actual',
                        help:'Al desactivar esta opción no se enviará la ubicación actual como ubicación del cliente',
                        hidden: true,
                    }
                }
            }
        };

        this.formError = {
            ruc_dni:{
                state: false,
                message: '',
                defaultValue: null,
            }
        }
        this.client_data = '';
        this.district_help = '';
        this.clientFormTwo = new FormData();

        this._completeDataFields();
        this._getCurrentUser();
    }


    _refreshFormData = () => {
        this.client_data = this.props.navigation.getParam('client_data','no_data');
        if( this.state.shouldUpdateForm ){
            this.setState({form_state:this.client_data});
            this.setState({prevFormData:this.client_data});
            this.setState({shouldUpdateForm: false});
            console.log(this.client_data);
            console.log('updated')
        }
        else if( this.client_data !='no_data' && this.state.prevFormData != this.client_data ){
            this.setState({shouldUpdateForm:true});
            console.log('se debe update')
        }
    };

    _checkClient = (id) => {
        this.setState({validating_rucdni: true});
        fetch('https://solucionesoggk.com/api/v1/client_exists?client_id='+id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Cache-Control': 'no-cache'
                    },
                    }).then((response) => response.json()).then((res => {
                        this.setState({validating_rucdni: false});
                        if(res.success == false){
                           Alert.alert("El RUC existe",
                                  res.message,
                                  [
                                    {text:"Ok", onPress: () => this.setState({form_state: res.data, itsAClientUpdate: true})},
                                    {text:"Ahora no", onPress: () => this.setState({form_state: ''})},
                                  ]);
                        }
                        else if(res.success == true){
                            console.log( 'asdasda state form', this.state.form_state );
                            this.setState({form_state: res.data })
                            alert(  res.data ? (res.message +' --> ' + res.data.razon_social) : res.message );
                        }
                    }));
    };

    _getCurrentUser = async () =>{
        var current_user = await AsyncStorage.getItem('current_user');
        this.setState({current_user : JSON.parse(current_user)});
    };

    _currentPosition = async () =>{
        var c_location = await Location.getCurrentPositionAsync({accuracy: Location.Accuracy.Highest});
        return c_location;
    };

    _currentPositionNavigator = async () =>{
        let locationOptions = {
            enableHighAccuracy : true,
            timeout : 60000,
            maximumAge : 0
        }
        this.setState({spinner: true});
        Geolocation.getCurrentPosition(this.currentPositionSuccess,this.currentPositionError,locationOptions);
    };

    _completeDataFields = async () => {
        fetch('https://solucionesoggk.com/api/v1/client_form_data', {
            method: 'GET',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            }).then((response) => response.json()).then((res => {
                if (res.success === true){
                    this.setState({tipo_empresa: res.data.tipo_empresa,distrito: res.data.distritos});                      
                }
                else{
                    alert(res.message);
                }
            }));
    };
    _filterDistrict = (text) => {
        if(this.state.distrito){
            let result = this.state.distrito.filter( distrito => distrito.distrito_name.startsWith(text) );
            if( result.length != 0 ){
                this.setState({district_help:result[0].distrito_name});
           }
            else{
                this.setState({district_help:'No aparece en la base de datos'});
            }
 //           console.log(text);
        }   
    };

    currentPositionSuccess = (position) => {
        this.clientFormTwo.append('latitude',position.coords.latitude);
        this.clientFormTwo.append('longitude',position.coords.longitude);
        this.clientFormTwo.append('timestamp',position.timestamp);
        if( !this.state.useShortForm ){
            if( !this.state.itsAClientUpdate ){
                fetch('https://solucionesoggk.com/api/v1/insert_client', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: this.clientFormTwo,
                    }).then((response) => response.json()).then((res => {
                        if (res.success === true){
                                if( this.client_data.id_cliente_no_ruc ){
                                            fetch('https://solucionesoggk.com/api/v1/delete_client_no_ruc?id='+this.client_data.id_cliente_no_ruc+'&idusuario='+this.state.current_user.id, {
                                                method: 'GET',
                                                headers: {
                                                    'Content-Type': 'multipart/form-data',
                                                },
                                                }).then( (response) => console.log(response.message)); 
                                }
                                
                            alert('Cliente creado!');
                            this.props.navigation.pop();
                        }
                        else{
                            alert(res.message);
                        }
                    }));
            }
            else{
                //console.log(this.clientFormTwo);
                fetch('https://solucionesoggk.com/api/v1/update_client', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: this.clientFormTwo,
                    }).then((response) => response.json()).then((res => {
                        if (res.success == true){
                            alert('Cliente actualizado!');
                            this.props.navigation.pop();
                        }
                        else{
                            alert(res.message);
                        }
                    }));
            }
        }
        else{
            fetch('https://solucionesoggk.com/api/v1/insert_client_no_ruc', {
                method: 'POST',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                body: this.clientFormTwo,
                }).then((response) => response.json()).then((res => {
                    if (res.success === true){
                        alert('Cliente creado!');
                        this.props.navigation.pop();                    
                    }
                    else{
                        alert(res.message);
                    }
                })); 
        }
        console.log(this.clientFormTwo);
        this.clientFormTwo = new FormData();
        this.setState({spinner: false});
    }

    currentPositionError = (err) => {
        console.log(err);
        this.setState({error : err.message});
        this.setState({spinner: false});
        alert("No se pudo obtener la ubicación, verifique el estado del GPS de su dispositivo e intente de nuevo por favor");
    }


    onSubmitUsingNavigator = (id, useshortform) => {
        if( useshortform ){
            var shortValidation = ['razon_social','distrito','direccion','tipo_empresa'];
            let valid_form = true;
            for( var index in shortValidation){
               var field_validation = this.clientform.getComponent(shortValidation[index]).validate();
               if(field_validation.errors.length > 0){
                   valid_form = false;
               }
            }
            if(!valid_form){
                alert("Los campos de rojo son obligatorios");
                return;
            }
            else{
                for( var index in shortValidation){
                    var field_validation = this.clientform.getComponent(shortValidation[index]).validate();
                    this.clientFormTwo.append(shortValidation[index],field_validation.value);  
                }
            }
       
        }
        else{
            let valid_form = this.clientform.getValue();
            if(!valid_form){
                alert("Los campos de rojo son obligatorios");
                return;
            }
            else{
                for(var key in valid_form){
                    this.clientFormTwo.append(key,valid_form[key]);
                }
            }
        }
        this.clientFormTwo.append('idusuario',id);
        this._currentPositionNavigator();
        console.log(this.clientFormTwo);
    }
        
    formChanged = (value) => {
        var updateOptions = t.update(this.state.formClientOptions, {
            fields: {
              ruc_dni: {
                disabled: {'$set': value.no_data},
                editable: {'$set': !value.no_data},
              },
              contacto_nombre: {
                disabled: {'$set': value.no_data},
                editable: {'$set': !value.no_data},
              },
              contacto_telefono: {
                disabled: {'$set': value.no_data},
                editable: {'$set': !value.no_data},
              },
              contacto_email: {
                disabled: {'$set': value.no_data},
                editable: {'$set': !value.no_data},
              },
              dias_credito: {
                disabled: {'$set': value.no_data},
                editable: {'$set': !value.no_data},
              },
              tipo_pago: {
                disabled: {'$set': value.no_data},
                editable: {'$set': !value.no_data},
                hidden: {'$set': value.no_data},
              },
              location_type: {
                disabled: {'$set': value.no_data},
                editable: {'$set': !value.no_data},
                hidden: {'$set': value.no_data},
              }
            }
          });
        this.setState({useShortForm:value.no_data});
        this.setState({form_state:value, formClientOptions: updateOptions});
        console.log(value);
    }

    render(){
        let location_types = t.enums({
            unica: 'Unica',
            fiscal: 'Fiscal',
            almacen: 'Almacén',
            cobranza: 'Cobranza',
        })
        
        let tipos_pago = t.enums({
            0: 'Efectivo',
            1: 'Transferencia',
            2: 'Cheque',
        })

        let dict = {};
        this.state.tipo_empresa.map( tipo => {
            dict[tipo.id_tipoemp] = tipo.tipoemp_nombre;
        })
        let tipos_empresa = t.enums(dict);
        var RUC_DNI = t.refinement(t.Number, (ruc_dni) => { 
                                                                let ruc_str = ruc_dni.toString();
                                                                if (ruc_str.length == 11 ){
                                                                    if(ruc_str.substr(0,2) == '10' || ruc_str.substr(0,2) == '20'){
                                                                        return true;
                                                                    }
                                                                    else{
                                                                        return false;
                                                                    }
                                                                }
                                                                else if (ruc_str.length == 8){
                                                                    return true;
                                                                }
                                                                else{
                                                                    return false;
                                                                }
        })
        RUC_DNI.getValidationErrorMessage = () => { return 'RUC inválido' };
        
        let Client = t.struct({
            no_data: t.Boolean,
            ruc_dni: RUC_DNI,
            razon_social: t.String,
            nombre_comercial: t.String,
            contacto_nombre: t.String,
            contacto_telefono: t.Number,
            contacto_email: t.maybe(t.String),
            distrito: t.String,
            direccion: t.String,
            tipo_empresa: tipos_empresa,
            dias_credito:t.Number,
            tipo_pago: tipos_pago,
            location_type: location_types,
            use_current_location: t.Boolean,
        })

        let defaults = {
            ruc_dni: 1231,
            razon_social: 'asdas',
            contacto_nombre: 'oscar',
            contacto_telefono: 234234,
            contacto_email: 'asdas',
            direccion: 'asdasd',
            dias_credito:1,
            use_current_location: true,
        }
        //this._refreshFormData();
        this._refreshFormData();
        return(
            <React.Fragment>
                <KeyboardAvoidingView behavior='padding'>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Cargando datos...'}
                    textStyle={styles.spinnerTextStyle}
                    />

                <Spinner
                    visible={this.state.validating_rucdni}
                    textContent={'Validando RUC/DNI... (puede tardar un poco)'}
                    textStyle={styles.spinnerTextStyle}
                    />

                <ScrollView>

                <Card>
                     <Form ref={clientinfo => this.clientform = clientinfo} type={Client} options={this.state.formClientOptions} onChange={this.formChanged} value={this.state.form_state}/>
                     <TouchableOpacity style={styles.buttonStyle} onPress={() => this.onSubmitUsingNavigator(this.state.current_user.id, this.state.useShortForm)}> 
                        <Text style={styles.textButton}>Guardar Cliente</Text>
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
    }
});
export default ClientForm;