import React from 'react';
import { StyleSheet, Text, View, StatusBar,
    TextInput, TouchableOpacity,
    Image, ScrollView, KeyboardAvoidingView, Picker, Alert} from 'react-native';
    import { Header,Card } from 'react-native-elements';
    import t from 'tcomb-form-native';
import Spinner from 'react-native-loading-spinner-overlay';
import AsyncStorage from '@react-native-community/async-storage';

var Form = t.form.Form;
var location_types = t.enums({
    fiscal: 'Fiscal',
    almacen: 'Almacén',
    cobranza: 'Cobranza',
})

class SucursalForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            current_user: '',
            form_state: '',
            current_position: {
                latitude: '',
                longitude: '',
            },
            spinner: false,
            clientList: [],
            
            formSucursalOptions: {
                fields: {
                    ruc_dni:{
                        label: 'RUC o DNI',
                        placeholder: 'RUC o DNI del cliente',
                        onEndEditing: (event) => this._checkClient(event.nativeEvent.text),
                        disabled: false,
                        help: this.ruc_dni_help,
                    },
                    direccion:{
                        autoCapitalize: 'characters',
                    },
                    distrito:{
                        autoCapitalize: 'characters',
                    }
                }
            }
        };
        this.ruc_dni_help = ' ';
        this.sucursalFormTwo = new FormData();
        this._getCurrentUser();
    }


    _getCurrentUser = async () =>{
        var current_user = await AsyncStorage.getItem('current_user');
        this.setState({current_user : JSON.parse(current_user)});
    }

    _checkClient = (id) => {
        console.log("checking");
        fetch('http://solucionesoggk.com/api/v1/check_client_exists?client_ruc='+id, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'Cache-Control': 'no-cache'
                    },
                    }).then((response) => response.json()).then((res => {
                        if(res.success == false){
                            alert(res.message);  
                            this.setState({formSucursalOptions: {
                                                                    fields: {
                                                                                ruc_dni: {
                                                                                        label: 'RUC o DNI',
                                                                                        onEndEditing: (event) => this._checkClient(event.nativeEvent.text),
                                                                                        help: ''
                                                                                            }
                                                                            }
                                                                }
                                           }) 
                        }
                        if(res.success == true){
                            // should show the name of the correct client above the ruc
                                       this.setState({formSucursalOptions: {
                                                                    fields: {
                                                                                ruc_dni: {
                                                                                        label: 'RUC o DNI',
                                                                                        onEndEditing: (event) => this._checkClient(event.nativeEvent.text),
                                                                                        help: res.data['razon_social']
                                                                                            }
                                                                            }
                                                                }
                                           })
                        }
                    }));
    }
    _currentPositionNavigator = async () =>{
        let locationOptions = {
            enableHighAccuracy : true,
            timeOut : 20000,
            maximunAge : 60 * 60 * 24
        }
        this.setState({spinner: true});
        navigator.geolocation.getCurrentPosition(this.currentPositionSuccess,this.currentPositionError,locationOptions);
    }

    currentPositionSuccess = (position) => {
        {/* get near clients*/}
        this.setState({spinner: false});

        console.log(position);
        this.sucursalFormTwo.append('latitude',position.coords.latitude);
        this.sucursalFormTwo.append('longitude',position.coords.longitude);
        this.sucursalFormTwo.append('timestamp',position.timestamp);
        console.log(this.sucursalFormTwo);
            fetch('http://solucionesoggk.com/api/v1/insert_sucursal', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                    body: this.sucursalFormTwo,
                    }).then((response) => response.json()).then((res => {
                        if (res.success == true){
                            alert(res.message);
                            this.props.navigation.pop();
                            this.sucursalFormTwo = new FormData();
                        }
                        else{
                            alert(res.message);
                        }

                    }));


    }

    currentPositionError = (err) => {
        console.log(err);
        this.setState({error : err.message});
        this.setState({spinner: false});
        alert("No se pudo obtener la ubicación, verifique el estado del GPS de su dispositivo e intente de nuevo por favor");
    }
      
    formChanged = (value) => {
       
        this.setState({form_state:value});
        //console.log(value);
    }

    onSubmit = (id) => {
        {/* submit the form */}
        //console.log(id);
        //console.log(this.state.current_position);
        
        let valid_form = this.sucursalform.getValue();
            if(!valid_form){
                alert("Los campos de rojo son obligatorios");
                return;
            }
            else{

                for(var key in valid_form){
                    this.sucursalFormTwo.append(key,valid_form[key]);
                }
                console.log(this.sucursalFormTwo);
                //this.props.navigation.pop();


                this._currentPositionNavigator();
            }
        //console.log(this.sucursalFormTwo);
    }
    render(){
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

        let Sucursal = t.struct({
            ruc_dni: RUC_DNI,
            location_type: location_types,
            direccion: t.String,
            distrito: t.String,
        })

        return(
            <React.Fragment>
                <KeyboardAvoidingView behavior='padding'>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Obteniendo clientes cercanos...'}
                    textStyle={styles.spinnerTextStyle}
                    />

                <ScrollView>

                <Card>
                     <Form ref={sucursalinfo => this.sucursalform = sucursalinfo} type={Sucursal} options={this.state.formSucursalOptions} onChange={this.formChanged} value={this.state.form_state}/>
                     <TouchableOpacity style={styles.buttonStyle} onPress={() => this.onSubmit(this.state.current_user.id)}> 
                        <Text style={styles.textButton}>Guardar Sucursal</Text>
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
export default SucursalForm;