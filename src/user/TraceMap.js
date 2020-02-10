import React from 'react';
import { StyleSheet, Text, View, StatusBar,
    TextInput, TouchableOpacity,
    Image, ActivityIndicator, AppState} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import AsyncStorage from '@react-native-community/async-storage';
import {Button, Icon} from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';



class TraceMap extends React.Component{
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
            error : null,
            client_list: [],
            others_list: [],
            no_ruc_others_list: [],
            no_ruc_my_list: [],
            appState : AppState.currentState,
            fine_location_access: 'denied',
        };
        this.unique_client_data = '';
        this._getCurrentUser();

    }
    
    componentDidMount = async () => {
        AppState.addEventListener('change', this._handleAppStateChange);
        this.unique_client_data = this.props.navigation.getParam('unique_client_data','no_data');
        this.setState({ready:true,
            region: {latitude: parseFloat(this.unique_client_data.latitud),
                        longitude: parseFloat(this.unique_client_data.longitud),
                        latitudeDelta:  0.00922*1.5,
                        longitudeDelta: 0.00421*1.5}
            });
    };

    componentWillUnmount = () => {
        AppState.removeEventListener('change', this._handleAppStateChange);
      };

    
    _refreshData = async () => {
        this._getUserClients();
    }
    _handleAppStateChange = (nextAppState) => {
        if (
          this.state.appState.match(/inactive|background/) &&
          nextAppState === 'active'
        ) {
          console.log('App has come to the foreground!');
          this._refreshData();
        }
        this.setState({appState: nextAppState});
      };

    _getCurrentUser = async () =>{
        var current_user = await AsyncStorage.getItem('current_user');
        this.setState( {current_user: JSON.parse(current_user)});
    }

    _getUserClients = async () => {
        fetch('http://solucionesoggk.com/api/v1/user_clients_detail?user_id='+this.state.current_user.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            }).then((response) => response.json()).then((res => {
                if (res.success === true){
                    this.setState({client_list: res.data});                      
                }
                else{
                    alert(res.message);
                }
            }));
        fetch('http://solucionesoggk.com/api/v1/no_ruc_user_clients_detail?user_id='+this.state.current_user.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            }).then((response) => response.json()).then((res => {
                if (res.success === true){
                    this.setState({no_ruc_my_list: res.data});                      
                }
                else{
                    alert(res.message);
                }
        }));
    }

    _getOtherUsersClients = async () => {
        fetch('http://solucionesoggk.com/api/v1/other_clients?user_id='+this.state.current_user.id, {
            method: 'GET',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            }).then((response) => response.json()).then((res => {
                if (res.success === true){
                    this.setState({others_list: res.data});                      
                }
                else{
                    alert(res.message);
                }
            }));
        fetch('http://solucionesoggk.com/api/v1/others_no_ruc_user_clients_detail?user_id='+this.state.current_user.id, {
                method: 'GET',
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                }).then((response) => response.json()).then((res => {
                    if (res.success === true){
                        this.setState({no_ruc_others_list: res.data});                      
                    }
                    else{
                        alert(res.message);
                    }
        }));
    }

    getMyLocation = () => {
        console.log("getting location");
        let locationOptions = {
            enableHighAccuracy : true,
            timeOut : 1,
            maximunAge : 60 * 60 * 24
        }
        this.setState({ready:false, error:null});
        navigator.geolocation.getCurrentPosition(this.getLocationSuccess,this.getLocationError,locationOptions);
        /* navigator.geolocation.getCurrentPosition(
            position => {
              const location = JSON.stringify(position);
      
              this.setState({ location });
            },
            error => Alert.alert(error.message),
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 }
          );*/
    };

    watchOnMove = () => {
        let options = {
            distanceFilter: 1,
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1,
        }
        this.watchID = navigator.geolocation.watchPosition( this.onWatchSuccess, error => {console.log(error)},options);
    }

    onWatchSuccess = (position) => {
        {/* alert(position.coords.latitude+' '+ position.coords.longitude); */}
        this.setState({ready:true,
            region: {latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                        latitudeDelta:  0.00922*1.5,
                        longitudeDelta: 0.00421*1.5,
                        timestamp: position.timestamp}
            });
    }

    getLocationSuccess = (position) => {
        this.setState({ ready:true,
                        region: {latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                    latitudeDelta:  0.00922*1.5,
                                    longitudeDelta: 0.00421*1.5,
                                    timestamp: position.timestamp }
                        
        });
    }

    getLocationError = (err) => {
        console.log(err);
        this.setState({error : err.message});
    }

    render(){
        console.log(AppState.currentState);
        console.log(this.state.client_list);
        ( this.unique_client_data && console.log(this.unique_client_data) );
        return(
            <View style={styles.container}>
            {
                !this.state.ready && ( <ActivityIndicator size="large" color="#0000ff" /> )
            }

            { this.state.ready && 
                (<MapView 
                    provider={PROVIDER_GOOGLE}
                    style={styles.map}
                    showsUserLocation={true}
                    region={this.state.region}>
                    <Marker title={this.unique_client_data.razon_social}
                    description={(this.unique_client_data.ruc_dni || "Hace "+ this.unique_client_data.days_ago+ " días") + " | " + (this.unique_client_data.sucursal_direccion || this.unique_client_data.direccion)} 
                    coordinate={{latitude:parseFloat(this.unique_client_data.latitud),longitude:parseFloat(this.unique_client_data.longitud)}}/>
            
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
export default TraceMap;