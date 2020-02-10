import React from 'react';
import { StyleSheet, Text, View, StatusBar,
    TextInput, TouchableOpacity,
    Image, ActivityIndicator, AppState} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import AsyncStorage from '@react-native-community/async-storage';
import {Button, Icon} from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';

class TraceMapImproved extends React.Component{
    constructor(){
        super();
        this.state = {
            current_user : '',
            ready : false,
            region: {   latitude : null,
                        longitude :null,
                        timestamp :null,
                        latitudeDelta:  0.00922*1.5,
                        longitudeDelta: 0.00421*1.5,
                        },
        };
        client_list = [];

    }
    
    componentDidMount = async () => {
        this.client_list = this.props.navigation.getParam('client_list',[]);
        if (this.client_list){
            this.setState({ready:true,
                region: {latitude: parseFloat(this.client_list[0].latitud),
                            longitude: parseFloat(this.client_list[0].longitud),
                            latitudeDelta:  0.00922*1.5,
                            longitudeDelta: 0.00421*1.5}
                });
        }
    };

    render(){
        return(
            <View style={styles.container}>
            {
                !this.state.ready && ( <ActivityIndicator size="large" color="#0000ff" /> )
            }

            { this.state.ready && 
                (<MapView 
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    style={styles.map} 
                    region={this.state.region}>
                    {
                        this.client_list &&
                        (
                            this.client_list.map( myclient => (
                                <Marker                                
                                coordinate={{ latitude: parseFloat(myclient.latitud), longitude: parseFloat(myclient.longitud) }}
                                title={myclient.razon_social}
                                description={ (myclient.sucursal_direccion || myclient.direccion) }
                                key={myclient.idcliubic}
                              />
                            ))
                        )
                    }
                </MapView> )
            }



            </View>         
            );

    }
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    button:{
        position: 'absolute',
        width: 20,
        height: 20,
        top: 10,
        left: 10,
        zIndex: 10
    },
    map: {
        ...StyleSheet.absoluteFillObject,
        zIndex: -1
      }
});
export default TraceMapImproved;