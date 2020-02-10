import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import Geolocation from 'react-native-geolocation-service';
import BackgroundFetch from "react-native-background-fetch";
import DeviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-community/async-storage';

let _getSomeInfo = async () =>{
        fetch('http://solucionesoggk.com/api/v1/appversion',
                { method: 'GET',
                 headers: {'Content-Type': 'multipart/form-data'} })
            .then( response => response.json() ).then( result => console.log(result) );
};

_getCurrentUser = async () =>{
    var current_user = await AsyncStorage.getItem('current_user');
    return JSON.parse(current_user);
};


let _postLocationRoute = (position) => {
        var formdata = new FormData();
        formdata.append('latitude',position.coords.latitude.toString());
        formdata.append('longitude',position.coords.longitude.toString());
        formdata.append('timestamp',position.timestamp);
        DeviceInfo.getBatteryLevel().then(batteryLevel => {
            formdata.append('battery_life',batteryLevel.toString());
            _getCurrentUser().then( current_user => 
                                                        {   formdata.append('idusuario', current_user.id)
                                                            fetch('http://solucionesoggk.com/api/v1/location', {
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


let MyHeadlessTask = async () => {
    let current_time = new Date();
    if( current_time.getDay() >= 1 && current_time.getDay() <= 5 && current_time.getHours() >= 9 && current_time.getHours() <= 18){
          Geolocation.getCurrentPosition(
                        _postLocationRoute,
                        error => console.log(error),
                        {
                            enableHighAccuracy : true,
                            timeout : 60000,
                            maximumAge : 0,
                        }
            );
    }
  BackgroundFetch.finish();
}

BackgroundFetch.registerHeadlessTask(MyHeadlessTask);
AppRegistry.registerComponent(appName, () => App);
