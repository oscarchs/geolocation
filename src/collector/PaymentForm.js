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


class PaymentForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            current_user: '',
            form_state: '',
            formPaymentOptions: {
                fields: {
                    idcajah:{
                        hidden:true,
                    },
                    total:{
                        label: 'Monto total',
                        editable: false,
                    },
                    pagos_recibidos:{
                        label: 'Monto de pagos Recibidos',
                        editable: false,
                    },
                    por_pagar: {
                        label: 'Monto por pagar',
                        editable: false,
                    },
                    tipo_pago: {
                        label: 'Tipo de pago',
                    }
                }
            },
            spinner: false,
            submmiting: false,
        };
        this.visitFormTwo = new FormData();
        this._getCurrentUser();
    }


    componentDidMount = () =>{
        let payment_data = this.props.navigation.getParam('payment_data','no_data');
        if( payment_data ){
            this.setState({form_state:payment_data});
        }
    }


    _getCurrentUser = async () =>{
        var current_user = await AsyncStorage.getItem('current_user');
        this.setState({current_user : JSON.parse(current_user)});
    }
    
    formChanged = (value) => {
        this.setState({form_state:value});
        console.log(value);
    }
    onSubmit = (id) => {
        {/* submit the form */}
        //console.log(id);
        //console.log(this.state.current_position);
        this.setState({submmiting: true});
        let valid_form = this.paymentForm.getValue();
        if( valid_form ){
            var paymentFormTwo = new FormData();
            for (var key in valid_form){
                if( key == 'por_pagar'){
                    paymentFormTwo.append(key, valid_form[key] - valid_form['pagado']);
                }
                else{
                    if( key != 'pagos_recibidos'){
                        paymentFormTwo.append(key,valid_form[key]);
                    }
                }
            }
            paymentFormTwo.append('idusuario', id);
            console.log(paymentFormTwo);
        }
        fetch('https://solucionesoggk.com/api/v1/add_payment', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Cache-Control': 'no-cache',
            },
            body: paymentFormTwo,
            }).then((response) => response.json()).then(res => {
                this.setState({submmiting: false});
                alert( res.message );    
                this.props.navigation.pop();


            });
    }

    render(){
        let tipo_pago = t.enums({
            0: 'Contado',
            1:'Transferencia',
            2: 'Cheque',
        })
    
        let Payment = t.struct({
            idcajah: t.Number,
            total: t.Number,
            pagos_recibidos: t.Number,
            por_pagar: t.Number,
            tipo_pago: tipo_pago,
            pagado: t.Number,
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
                    textContent={'Guardando pago...'}
                    textStyle={styles.spinnerTextStyle}
                    />

                <ScrollView>

                <Card>


                     <Form ref={payment => this.paymentForm = payment} type={Payment} options={this.state.formPaymentOptions} onChange={this.formChanged} value={this.state.form_state}/>

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
export default PaymentForm;