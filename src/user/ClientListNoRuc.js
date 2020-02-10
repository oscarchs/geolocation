import React from 'react';
import { StyleSheet, Text, View, StatusBar,
    TextInput, TouchableOpacity,
    Image, ScrollView, KeyboardAvoidingView, Picker, FlatList, ListRenderItem, RefreshControl} from 'react-native';
    import { Header,Card, ListItem, List } from 'react-native-elements';
    import t from 'tcomb-form-native';
import CustomListItem from '../CustomListItem'; 
import AsyncStorage from '@react-native-community/async-storage';

var Form = t.form.Form;

class ClientListNoRuc extends React.Component{
    constructor(props){
        super(props);

        this.state = {
            current_user: '',
            client_list: null,
            refreshing: false,
        };
        this._getCurrentUser().then( () => this._getClientList() );
        
    }

    _onRefresh = () => {
        this.setState({refreshing: true});
        this._getClientList().then(() => {
          this.setState({refreshing: false});
        });
      }
    
    _getCurrentUser = async () =>{
        var current_user = await AsyncStorage.getItem('current_user');
        this.setState({current_user : JSON.parse(current_user)});
    }

    _getClientList = async () =>{
        fetch('http://solucionesoggk.com/api/v1/no_ruc_user_clients_detail?user_id='+this.state.current_user.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Cache-Control': 'no-cache'
            },
            }).then((response) => response.json()).then((res => {
                if (res.success === true){
                    this.setState({client_list: res.data});                      
                }
                else{
                    alert(res.message);
                }
            }));
    }

    render(){
        //this.state.client_list ? (this.state.client_list.map( (item) => console.log(item.razon_social)))  : (console.log("asda"));
        return(
            <React.Fragment>
                <KeyboardAvoidingView style={styles.container_avoid_tab} behavior='padding'>
        <ScrollView  refreshControl={ <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh.bind(this)} />  }> 
                <Card title="Lista de Clientes">
                {
                    this.state.client_list ?
                    (
                        this.state.client_list.map((item) => (
                            delete item.creador,
                            delete item.pin_color,
                            <ListItem
                                Component={CustomListItem}
                                razon_social={item.razon_social}
                                direccion={item.direccion}
                                tipo_empresa = {item.tipo_empresa}
                                creacion = {item.created_at}
                                key={item.id_cliente_no_ruc}
                                onPress = { () => {this.props.navigation.navigate('CreateNewClient',{client_data: item})}}
                            />
                            ))
                    ) : (
                        <Text>No hay datos aún</Text>
                    )
                    
                }
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

export default ClientListNoRuc;