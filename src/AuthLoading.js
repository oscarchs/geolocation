import React from 'react';
import { StyleSheet, Text, View, StatusBar,
    TextInput, TouchableOpacity,
    Image, ActivityIndicator} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

class AuthLoading extends React.Component{
    constructor(){
        super();
        this.state = {
            current_user: '',
        };
        this._loadInitialState().then( () => this._getPrivileges() );
    }

    _loadInitialState = async () => {
        var current_user = await AsyncStorage.getItem('current_user');
        this.setState({current_user:JSON.parse(current_user)});
  
        //this.props.navigation.navigate(current_user == null ? 'Login' : 'Home');
    };

    _getPrivileges = () => {
        if( this.state.current_user == null){
            this.props.navigation.navigate('Login');
        }
        else{
            console.log(this.state.current_user.id);
            if( this.state.current_user.idrol == '1'){
                console.log("es admin");
                this.props.navigation.navigate('AdminHome');
            }
            else if( this.state.current_user.idrol == '6' ){
                console.log("is debt collector");
                this.props.navigation.navigate('CollectorHome');
            }
            else if( this.state.current_user.idrol == '7' ){
                console.log("is driver");
                this.props.navigation.navigate('DriverHome');
            }
            else{
                console.log("es usuario regular");
                this.props.navigation.navigate('Home');
            }
        }
    };
    render(){
        return(
            <View>
            <ActivityIndicator />
            <StatusBar barStyle="default" />
            </View>

        );
    }
}



const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    }
});
export default AuthLoading;