import React from 'react';
import { StyleSheet, Text, View, StatusBar,
    TextInput, TouchableOpacity,
    Image, ScrollView, RefreshControl, Picker} from 'react-native';
import { SearchBar, Button,Header,Card, ListItem, List } from 'react-native-elements';
import CustomMenuItem from '../CustomMenuItem';
import Spinner from 'react-native-loading-spinner-overlay';
import CustomDetailedItem from '../CustomDetailedItem';
import AsyncStorage from '@react-native-community/async-storage';

class SearchPage extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            current_user : '',
            searchKey: '',
            searchData: '',
            searchCriteria:'ruc_dni',
            spinner: false,

        };
    }

    _updateSearch = (searchKey) => {
      this.setState({ searchKey })
    }

    _showClientInMap = (item) => {
      this.props.navigation.navigate('TraceMap',{unique_client_data: item})
    }

    _getData = () => {
      this.setState({spinner: true});
      console.log("searching for: " + this.state.searchKey);
      fetch('https://solucionesoggk.com/api/v1/client_status_by_criteria?criteria=' + this.state.searchCriteria + "&key=" + this.state.searchKey, {
        method: 'GET',
        headers: {
            'Content-Type': 'multipart/form-data',
            'Cache-Control': 'no-cache'
        },
        }).then((response) => response.json()).then((res => {
            this.setState({spinner: false});
            if (res.success == true){
              this.setState({searchData:res.data})
            }
            else{
              this.setState({searchData:''})
              alert(res.message);
            }
        }));
    }

    render(){
        const { search } = this.state;
        return(
            <React.Fragment>
                <Spinner
                    visible={this.state.spinner}
                    textContent={'Buscando en la base de datos'}
                    textStyle={styles.spinnerTextStyle}
                />

            <ScrollView> 
            <SearchBar
            lightTheme
            round

            keyboardType=
            {
              this.state.searchCriteria == "ruc_dni" ? "numeric": "default" 
            }
            placeholder= {this.state.searchCriteria}
            onChangeText={this._updateSearch}
            value={this.state.searchKey}
          />
          <Picker
            selectedValue={this.state.searchCriteria}
            style={{height: 50}}
            onValueChange={ itemValue => {this.setState({searchCriteria: itemValue})}}>
            <Picker.Item label="RUC/DNI" value="ruc_dni" />
            <Picker.Item label="Razón social" value="razon_social" />
          </Picker>
          <Button
            title="Buscar"
            onPress={ this._getData }
          />

         <Card title="Resultados de búsqueda">
                {
                    this.state.searchData ?
                    (
                        this.state.searchData.map((item) => (
                             <ListItem
                                Component={CustomDetailedItem}
                                razon_social={item.razon_social}
                                direccion={item.sucursal_direccion || item.direccion}
                                contacto_nombre = {item.contacto_nombre}
                                contacto_telefono = {item.contacto_telefono}
                                ubicacion={ item.latitud ? ("Tiene ubicacion") : ("No tiene ubicación")}
                                usuario = { item.name }
                                key={item.idcliubic}
                                onPress={ () => this._showClientInMap(item)}
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
export default SearchPage;