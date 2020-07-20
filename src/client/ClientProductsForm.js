import React from 'react';
import { StyleSheet, Text, View, StatusBar,
    TextInput, TouchableOpacity,
    Image, ScrollView, KeyboardAvoidingView, Picker, Alert} from 'react-native';
    import { Header,Card, ListItem, Divider,Icon } from 'react-native-elements';
    import t from 'tcomb-form-native';
import Spinner from 'react-native-loading-spinner-overlay';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import AsyncStorage from '@react-native-community/async-storage';
import Geolocation from 'react-native-geolocation-service';
import CartItem from '../CartItem';

var Form = t.form.Form;


class ClientProductsForm extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            current_user: '',
            current_position: {
                latitude: '',
                longitude: '',
            },
            selected_client: '',
            spinner: false,
            submmiting: false,
            product_list: [],
            selected_products:'',
            selected_products_post_info:[],
            sub_total: 0,
            igv: 0,
            total: 0,
        };
        this.selected_id;
        this.selected_id_type;
        this._getCurrentUser();
    }


    componentDidMount = () =>{
        //this._currentPositionNavigator();
        this.getProductList();
    }


    _getCurrentUser = async () =>{
        var current_user = await AsyncStorage.getItem('current_user');
        this.setState({current_user : JSON.parse(current_user)});
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

    getProductList = () => {
        fetch('https://solucionesoggk.com/api/v1/product_list_categorized', {
            method: 'GET',
            headers: {
                    'Content-Type': 'multipart/form-data',
                    'Cache-Control': 'no-cache',
                },
            }).then((response) => response.json()).then(res => {
                this.setState({  product_list: res });
            });
    }
    _removeItem = (selected) => {
        let new_list = this.state.selected_products.filter( (item) =>{
                                                    return item !== selected
                                                });
        this.setState({selected_products:new_list });
        let new_post = this.state.selected_products_post_info.filter( (item) => {
            return (item && item.idproducto !== selected.idproducto);
        });
        this.setState({selected_products_post_info:new_post});
        console.log(this.state.selected_products_post_info);
    }

    _addItem = (selected) => {
        {/*
        let new_product_list = this.state.product_list.filter( 
                    (item) =>{
                            if( item.name.substr(0,item.name.length-4) == selected.categoria){
                                item.children = item.children.filter( (item2) =>{
                                    return item2 !== selected;
                                    
                                });
                            }
                            return item;   
                    }
                ); 
        this.setState({product_list:new_product_list});
        */}
        if(this.state.selected_products){
            if(this.state.selected_products.includes(selected)){
                alert("El producto ya ha sido seleccionado");
                return;
            }
        };
        this.setState({selected_products: [...this.state.selected_products, selected]});
        let new_post_info = {
                    'idproducto':selected.id,
                    'nombre': selected.name,
                    'cantidad':'1',
                    'precio_unit':selected.precio,
                    'precio_total':selected.precio
        };
        
        this.setState({selected_products_post_info: [...this.state.selected_products_post_info, new_post_info]});
        console.log(this.state.selected_products_post_info);    
    }

    onSubmit = (id) => {
        let valid_form = this.visitform.getValue();
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
        }
        this.visitFormTwo = new FormData();
        this.props.navigation.pop();
    }

    _updateTotals = () => {
        if( this.state.selected_products_post_info.length ){
            var sub_total;
            var igv;
            var total = 0.0;
            this.state.selected_products_post_info.map( (product) => {
                 total += parseFloat(product.precio_total);
            });
            igv = total*18/100;
            sub_total= total - igv;
            this.setState({total:total, igv:igv, sub_total: sub_total});
        }
        else{
            this.setState({sub_total:0, igv:0, total:0});
        }
    }

    _onQuantityChange = (cantidad,name) =>{
        let update_form = this.state.selected_products_post_info.filter( (item) => {
            if(item.nombre == name){
                item.cantidad = cantidad;
                item.precio_total = ( (cantidad * item.precio_unit).toPrecision(4)).toString();
            }
            return item;
        });
        this.setState({selected_products_post_info:update_form});
        console.log(this.state.selected_products_post_info);
    }

    _onUnitaryPriceChange = (price,name) =>{
        let update_form = this.state.selected_products_post_info.filter( (item) => {
            if(item.nombre == name){
                item.precio_unit = price;
                item.precio_total = ( (item.cantidad * price).toPrecision(4)).toString();
            }
            return item;
        });
        this.setState({selected_products_post_info:update_form});
        console.log(this.state.selected_products_post_info);
    }


    _confirmation = (item) =>{
        this._updateTotals();
        if( this.state.selected_products_post_info.length ){
              Alert.alert(
                '¿Desea continuar?',
                'Verifique, los productos seleccionados y montos totales. A continuación deberá completar información de cliente y fechas de pago.',
                [
                  {text: 'OK', 
                      onPress: () => {
                        console.log(this.state.total);
                        this.props.navigation.navigate('ClientOrderForm',{selected_products:this.state.selected_products_post_info, 
                                                                    totals:{
                                                                            sub_total:this.state.sub_total,
                                                                            igv:this.state.igv,
                                                                            total:this.state.total}
                        });
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
        else{
            alert('Debe seleccionar al menos un producto');
        }
    }

    render(){

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
                        <SectionedMultiSelect
                        single
                        hideConfirm
                        items={this.state.product_list}
                        uniqueKey="name"
                        subKey="children"
                        expandDropDowns
                        searchPlaceholderText="Búsqueda de productos"
                        selectText={"Lista de Productos"}
                        showDropDowns={true}
                        expandDropDowns = {false}
                        readOnlyHeadings={true}
                        onSelectedItemsChange={ selected => {} }
                        onSelectedItemObjectsChange={ (selected) => { this._addItem(selected[0]) } }
                        styles = {styles.map_options}
                        />

                <Card title={"Productos elegidos"}>
                        {
                            this.state.selected_products_post_info ?
                            (
                                this.state.selected_products_post_info.map((item) => (
                                     <ListItem
                                        Component={CartItem}
                                        cantidad={item.cantidad}
                                        precio_unit={item.precio_unit}
                                        precio_total={item.precio_total}
                                        name={item.nombre}
                                        key={item.idproducto}
                                        on_quantity_change={ this._onQuantityChange }
                                        on_unit_price_change={ this._onUnitaryPriceChange }
                                        remove={ () => this._removeItem(item)}
                                        editable={false}
                                    />
                                    ))
                            ) : (
                                <Text>No se seleccionó ningún producto aún</Text>
                            )
                            
                        }
                <Divider style={{ backgroundColor: 'grey', height:2, marginTop:10}} />


                    <View style={{flex: 1, flexDirection: 'row', marginBottom:2, marginTop:10}}>
                        <View style={{flex:1.5,width: 100, height: 20}}>
                            <Text style={{color:'grey',fontWeight: 'bold'}}>Subtotal</Text>
                         </View> 
                        <View style={{flex:1.5,width: 100, height: 20}}>
                            <Text style={{color:'grey',fontWeight: 'bold'}}>IGV</Text>
                         </View> 
                        <View style={{flex:1.5,width: 100, height: 20, backgroundColor: 'white'}}>
                            <Text style={{color:'grey',fontWeight: 'bold'}}>Total</Text>
                        </View>
                         <View style={{flex:1.5,width: 100, height: 20, backgroundColor: 'white'}}>
                            <Text style={{color:'grey',fontWeight: 'bold'}}>Actualizar</Text>
                        </View>
                    </View>
                    <View style={{flex: 1, flexDirection: 'row', marginBottom:2, marginTop:10}}>
                        <View style={{flex:1.5,width: 100, height: 20}}>
                            <Text style={{color:'grey',fontWeight: 'bold'}}>{this.state.sub_total.toFixed(2)}</Text>
                         </View> 
                        <View style={{flex:1.5,width: 100, height: 20}}>
                            <Text style={{color:'grey',fontWeight: 'bold'}}>{this.state.igv.toFixed(2)}</Text>
                         </View> 
                        <View style={{flex:1.5,width: 100, height: 20, backgroundColor: 'white'}}>
                            <Text style={{color:'grey',fontWeight: 'bold'}}>{this.state.total.toFixed(2)}</Text>
                        </View>
                        <View style={{flex:1.5,width: 100, height: 20, backgroundColor: 'white'}}>
                            <Icon name='refresh' type='font-awesome' iconStyle={{color:'grey'}} onPress={ () => this._updateTotals() }/> 
                        </View>
                    </View>

                     <TouchableOpacity style={styles.buttonStyle} onPress={ this._confirmation }> 
                        <Text style={styles.textButton}>Confirmar Pedido</Text>
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
export default ClientProductsForm;