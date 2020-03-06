import React from 'react';
import { StyleSheet, Text, View, StatusBar,
    TextInput, TouchableOpacity,
    Image, ActivityIndicator, AppState, ToastAndroid} from 'react-native';
import MapView, {Marker, Polyline, PROVIDER_GOOGLE} from 'react-native-maps';
import AsyncStorage from '@react-native-community/async-storage';
import {Button, Icon} from 'react-native-elements';
import Spinner from 'react-native-loading-spinner-overlay';
import Geolocation from 'react-native-geolocation-service';
import SectionedMultiSelect from 'react-native-sectioned-multi-select';
import { NavigationEvents } from 'react-navigation';


class AdminMap extends React.Component{
    constructor(){
        super();
        this.state = {
            region:'',
            map_ready: false,
            appState : AppState.currentState,
            client_clist: [],
            selected_users: [],
            selected_date: [],
            user_routes: [],
            user_list: [ {'name': 'Usuarios', 'id':0, 'children':[]}],
            todays_all_routes: [],
            last_date: '',
        };
        watchID = null;

    }
    
    componentDidMount = async () => {
        AppState.addEventListener('change', this._handleAppStateChange);
        this._getCurrentLocation();
        this._getTodaysRoutes();
        this._getDatesForSelection();
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
        if( this.state.selected_date.length > 0){
            this._getRoutesForSelectedDate(this.state.selected_date);
        }
        else{
            this._getTodaysRoutes();
        }

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
        //this._getClientsData(position);
    };
    
    _getDatesForSelection = () => {
        fetch('https://solucionesoggk.com/api/v1/dates_routes', {
            method: 'GET',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Cache-Control': 'no-cache' 
            },
            }).then((response) => response.json()).then( (res => {
                if (res.success === true){
                    var date_list = {
                                    name:'Fecha',
                                    id: 0,
                                    children: Array.from( res.data, item => {
                                                                        let dict = {};
                                                                        dict['id'] = item.date;
                                                                        dict['name'] = item.date;
                                                                        return dict;      
                                                                    } 
                                                        ),
                                    }
                    res.data.map( item => console.log(item) );
                    this.setState({last_date: res.data[0]});
                    this.setState({  user_routes: [...this.state.user_routes, date_list]});
                }
                else{
                    alert(res.message);
                }
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
        //this._getClientsData(position);
    };

    _currentLocationError = (err) => {
        console.log(err);
        this.setState({error : err.message});
    };

    _navigateOut = () =>{
        console.log("did blur");
        console.log(this.watchID);
        Geolocation.clearWatch(this.watchID);
    };

    _getTodaysRoutes = () => {
        console.log("getting routes for today (default) ");
        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        fetch('https://solucionesoggk.com/api/v1/routes/' + date, {
            method: 'GET',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Cache-Control': 'no-cache' 
            },
            }).then((response) => response.json()).then( (res => {
                if (res.success === true){
                    this.setState({todays_all_routes:res.data});
                    console.log(res.data);
                    this.setState({spinner: false});
                    var user_list = Array.from( res.data, item => {
                                                                        let dict = {};
                                                                        dict['id'] = item.name;
                                                                        dict['name'] = item.name;
                                                                        return dict;      
                                                                    } 
                                                        );
                    this.setState(state => { state.user_list[0].children = user_list });
                }
                else{
                    alert(res.message);
                }
            }));    
    };

    _getRoutesForSelectedDate = (selected) => {
        console.log("getting routes for a given date"+selected);
        this.setState({selected_date: selected});
        fetch('https://solucionesoggk.com/api/v1/routes/' + selected, {
            method: 'GET',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Cache-Control': 'no-cache' 
            },
            }).then((response) => response.json()).then( (res => {
                if (res.success === true){
                    this.setState({todays_all_routes:res.data});
                    console.log(res.data);
                    this.setState({spinner: false});
                                        var user_list = Array.from( res.data, item => {
                                                                        let dict = {};
                                                                        dict['id'] = item.name;
                                                                        dict['name'] = item.name;
                                                                        return dict;      
                                                                    } 
                                                        );
                    this.setState(state => { state.user_list[0].children = user_list });
                }
                else{
                    alert(res.message);
                }
            }));    
    };


    _onSelectedUsersChange = (selected) => {
        this.setState({ selected_users:selected });
        console.log(selected);
    };

    _onConfirmUserList = () => {
        console.log(this.state.selected_users);
    };

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
                        this.state.todays_all_routes && 
                        (
                            this.state.todays_all_routes.map( (user) => (
                                            this.state.selected_users.includes(user.name) &&
                                            (
                                                <Polyline coordinates={user.latlng} strokeColor={user.pin_color} strokeWidth={3} key={user.name} />
                                            )

                                )
                            )
                        )
                       
                    }

                    {
                        this.state.todays_all_routes &&
                            this.state.todays_all_routes.map( (user) => (
                                this.state.selected_users.includes(user.name) &&
                                (    
                                    user.routes.map( (routes) => (
                                            <Marker coordinate = {{ latitude:routes.latitude, longitude:routes.longitude}} 
                                                    key={routes.time} title={user.name} description={"Hora: "+routes.time+" Batería : "+Math.floor((routes.battery_life)*100)+"%"}
                                                    pinColor={user.pin_color}
                                                    />
                                        )
                                    )
                                )
                            )
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

                <View style={{ position: 'absolute', top: 30, left: 30,flex: 1, flexDirection: 'row'}}>
                        <SectionedMultiSelect
                                single
                                hideConfirm
                                items={this.state.user_routes}
                                alwaysShowSelectText
                                uniqueKey="id"
                                subKey="children"
                                expandDropDowns
                                searchPlaceholderText="Buscar una fecha"
                                selectText={"Ver usuarios"}
                                showDropDowns={true}
                                expandDropDowns = {true}
                                readOnlyHeadings={false}
                                onSelectedItemsChange={ this._getRoutesForSelectedDate }
                                selectedItems={this.state.selected_date}
                                styles = {styles.map_options}
                                />

                        <SectionedMultiSelect
                            items={this.state.user_list}
                            alwaysShowSelectText
                            uniqueKey="id"
                            subKey="children"
                            expandDropDowns
                            searchPlaceholderText="Seleccionar Usuarios"
                            selectText={"Ver usuarios"}
                            showDropDowns={true}
                            expandDropDowns = {true}
                            readOnlyHeadings={false}
                            onSelectedItemsChange={ this._onSelectedUsersChange }
                            onConfirm={ this._onConfirmUserList }
                            selectedItems={this.state.selected_users}
                            styles = {styles.map_options}
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
      },
    map_options:{
        color: 'black',
    },
});
export default AdminMap;