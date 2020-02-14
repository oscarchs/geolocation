import React from 'react';
import { PermissionsAndroid } from 'react-native';
import BackgroundFetch from "react-native-background-fetch";
import Geolocation from 'react-native-geolocation-service';
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';

class LocationService{
    constructor(){
      this.current_user = '';
    }

    _getCurrentUser = async () =>{
        var current_user = await AsyncStorage.getItem('current_user');
        return JSON.parse(current_user);
    };

    _checkLocationPermissions = async () => {
        const granted = await PermissionsAndroid.check( PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION );
        if (!granted) {
          console.log( "You can use the ACCESS_FINE_LOCATION" )
          try{
            const gps_permission = await PermissionsAndroid.request(
                  PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                  {
                    title: 'OGGK',
                    message:
                      'OGGK necesita acceso a su ubicación',
                    buttonNeutral: 'Luego',
                    buttonNegative: 'Cancelar',
                    buttonPositive: 'Aceptar',
                  },
                );
                if (gps_permission === PermissionsAndroid.RESULTS.GRANTED) {
                  console.log('Location Permissions granted!');
                } 
                else{
                  console.log('Location Permissions Denied!');
                }
            } 
            catch (err){
                console.warn(err);
            }
        } 
        else {
          console.log( "ACCESS_FINE_LOCATION permission already GRANTED" )
        }        
    };

    _getSomeInfo = async () => {
        fetch('https://solucionesoggk.com/api/v1/appversion',
                { method: 'GET',
                 headers: {'Content-Type': 'multipart/form-data'} })
            .then( response => response.json() ).then( result => console.log(result) );
    };

    _postLocationRoute = async (position) => {
        var formdata = new FormData();
        var current_user = AsyncStorage.getItem('current_user');
        formdata.append('latitude',position.coords.latitude.toString());
        formdata.append('longitude',position.coords.longitude.toString());
        formdata.append('timestamp',position.timestamp);
        DeviceInfo.getBatteryLevel().then(batteryLevel => {
            formdata.append('battery_life',batteryLevel.toString());
            this._getCurrentUser().then( current_user => 
                                                        {   formdata.append('idusuario', current_user.id)
                                                            fetch('https://solucionesoggk.com/api/v1/location', {
                                                                    method: 'POST',
                                                                    headers: {
                                                                       'Content-Type': 'multipart/form-data',
                                                                    },
                                                                    body: formdata,
                                                            });
                                                        }
                                    );

        });
    };

    _startBackgroundService = async () =>{
        this._checkLocationPermissions();
        console.log("just configure the background service...");
        BackgroundFetch.configure({
          minimumFetchInterval: 15,     // <-- minutes (15 is minimum allowed)
          // Android options
          stopOnTerminate: false,
          startOnBoot: true,
          enableHeadless: true,
        }, () => {
            let current_time = new Date();
            if( current_time.getDay() >= 1 && current_time.getDay() <= 5 && current_time.getHours() >= 9 && current_time.getHours() <= 18){
                Geolocation.getCurrentPosition(
                    this._postLocationRoute,
                    error => console.log(error),
                    {
                        enableHighAccuracy : true,
                        timeout : 60000,
                        maximumAge : 0,
                    }
                );
            }
            BackgroundFetch.finish(BackgroundFetch.FETCH_RESULT_NEW_DATA);
        }, (error) => {
          console.log("Error ...");
        });
    };

};

export default LocationService;