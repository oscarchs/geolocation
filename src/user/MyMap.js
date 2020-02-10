import React from 'react';
import { StyleSheet, Text, View, StatusBar,
    TextInput, TouchableOpacity,
    Image, ActivityIndicator, AppState, ToastAndroid} from 'react-native';
import MapView, {Marker, PROVIDER_GOOGLE} from 'react-native-maps';
import AsyncStorage from '@react-native-community/async-storage';
import {Button, Icon} from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import Geolocation from 'react-native-geolocation-service';
import { NavigationEvents } from 'react-navigation';


class MyMap extends React.Component{
    constructor(){
        super();
        this.state = {
            region:'',
            map_ready: false,
            appState : AppState.currentState,
            client_clist: [],
        };
        watchID = null;

    }
    
    componentDidMount = async () => {
        AppState.addEventListener('change', this._handleAppStateChange);
        this._getCurrentLocation();
        //this._followOnMoving();
    };

    componentWillUnmount = () => {
        AppState.removeEventListener('change', this._handleAppStateChange);
    };

    _handleAppStateChange = (nextAppState) => {

        if (nextAppState === 'background'){
          // Do something here on app background.
          console.log("App is in Background Mode.")
          Geolocation.clearWatch(this.watchID);
          //Geolocation.stopObserving();
        }
        if ( this.state.appState.match(/inactive|background/) && nextAppState === 'active' ){
          console.log('App has come to the foreground!');
        }
        this.setState({appState: nextAppState});
    };

    _refreshData = async () => {
        this.setState({spinner: true});
        this._getCurrentLocation();
    };


    _followOnMoving = () => {
        let options = {
            distanceFilter: 50,
            enableHighAccuracy: true,
            timeout: 20000,
            maximumAge: 1,
        }
        this.watchID = Geolocation.watchPosition( this._onFollowSuccess, error => {console.log(error)},options);
    };

    _onFollowSuccess = (position) => {
        //console.log(position.coords.latitude + " " + position.coords.longitude);
        //ToastAndroid.showWithGravityAndOffset(
        //  position.coords.latitude + " " + position.coords.longitude,
        //  ToastAndroid.LONG,
        //  ToastAndroid.BOTTOM,
        //  25,
        //  50,
        //);
        this._getClientsData(position);
    };
    
    _getClientsData = (position) => {
        console.log(position);
        var current_position = new FormData();
        current_position.append('latitude',position.coords.latitude);
        current_position.append('longitude',position.coords.longitude);
        fetch('http://solucionesoggk.com/api/v1/map_clients_in_range',{
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Cache-Control': 'no-cache, no-store, must-revalidate',
                'Pragma': 'no-cache',
                'Expires': 0
            },
            body: current_position,
            }).then((response) => response.json()).then((res => {
                if (res.success === true){
                    console.log(res.data);
                    this.setState({client_list: res.data});
                      ToastAndroid.showWithGravityAndOffset(
                        res.message,
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50,   
                    );                  
                }
                else{
                    this.setState({client_list: res.data});
                      ToastAndroid.showWithGravityAndOffset(
                        res.message,
                        ToastAndroid.LONG,
                        ToastAndroid.BOTTOM,
                        25,
                        50,   
                    );
                }
                this.setState({spinner: false});
        }));
    };


    _getCurrentLocation = () => {
        let locationOptions = {
            enableHighAccuracy : true,
            timeout : 60000,
            maximumAge : 0,
        }
        Geolocation.getCurrentPosition(
                                        this._currentLocationSucess,
                                        this._currentLocationError,
                                        locationOptions
                                    );
    };

    _currentLocationSucess = (position) => {
        this.setState({ map_ready:true,
                        region: {latitude: position.coords.latitude,
                                    longitude: position.coords.longitude,
                                    latitudeDelta:  0.00922*1.5,
                                    longitudeDelta: 0.00421*1.5,
                                    timestamp: position.timestamp }
                        
        });
        this._getClientsData(position);
    };

    _currentLocationError = (err) => {
        console.log(err);
        this.setState({error : err.message});
    };

    _navigateOut = () =>{
        console.log("did blur");
        console.log(this.watchID);
        Geolocation.clearWatch(this.watchID);
    }


    render(){
        return(
            <View style={styles.container}>
            {
                !this.state.map_ready && ( <ActivityIndicator size="large" color="#0000ff" /> )
            }
            <NavigationEvents
              onDidFocus={ this._followOnMoving() }
              onWillBlur={ this._navigateOut }
            />
            <Spinner
                visible={this.state.spinner}
                textContent={'Actualizando mapa...'}
                textStyle={styles.spinnerTextStyle}
            />
            { this.state.map_ready && 
                (<MapView 
                    provider={PROVIDER_GOOGLE}
                    showsUserLocation={true}
                    style={styles.map}
                    initialRegion={this.state.region}
                    followUserLocation={true}>

                    {
                        this.state.client_list &&
                        (
                            this.state.client_list.map( myclient => (
                                <Marker                                
                                coordinate={{ latitude: parseFloat(myclient.latitud), longitude: parseFloat(myclient.longitud) }}
                                title={myclient.razon_social}
                                description={ (myclient.sucursal_direccion || myclient.direccion) }
                                pinColor={myclient.pin_color}
                                key={myclient.id}
                              />
                            ))
                        )
                    }

                </MapView> )
            }
            <View style={{ position: 'absolute', bottom: 30, right: 30 }}>

            <Icon
                reverse
                name='autorenew'
                color='#517fa4'
                onPress={ () => {  this._refreshData() }}
                />
                
            </View>
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
export default MyMap;