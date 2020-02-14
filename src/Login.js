import React from 'react';
import { StyleSheet, Text, View, StatusBar,
        TextInput, TouchableOpacity,
        Image, KeyboardAvoidingView} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';


class Login extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            email:'',
            password:'',
            last_login_email:'',
        };
        this._getLastLogin();
    }

    _getLastLogin = async() => {
        var last_login_email = await AsyncStorage.getItem('user_mail');
        if (last_login_email != null){
            this.setState({email: last_login_email});
        }
    }
    render() {
        return(
            <KeyboardAvoidingView style={styles.container} behavior='padding'>
            
                 <Image
                    style={{width: 200, height: 100}}
                    source={{ uri: 'https://www.solucionesoggk.com/images/logo1.png'}}/>

                    <TextInput style={styles.inputBox}
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder="Usuario"
                    placeholderTextColor = "#9e9e9e"
                    selectionColor="#fff"
                    onChangeText={ (text) => this.setState({email:text})}
                    defaultValue = {this.state.email}
                    
                    />
                    
                    <TextInput style={styles.inputBox}
                    underlineColorAndroid='rgba(0,0,0,0)' 
                    placeholder="Contraseña"
                    secureTextEntry={true}
                    placeholderTextColor = "#9e9e9e"
                    onChangeText={ (text) => this.setState({password:text})}
                    />
     
                    <TouchableOpacity style={styles.buttonStyle} onPress={this.authenticate}> 
                        <Text style={styles.textButton}>Ingresar</Text>
                    </TouchableOpacity>

                    {/*<TouchableOpacity style={styles.buttonStyle} onPress={() => this.props.navigation.navigate('Map')}> 
                        <Text style={styles.textButton}>Map</Text>
                    </TouchableOpacity>

                    
                    <TouchableOpacity style={styles.buttonStyle} onPress={() => this.props.navigation.navigate('BackgroundLocation')}> 
                        <Text style={styles.textButton}>BackgroundLocation</Text>
                     </TouchableOpacity> */}
            </KeyboardAvoidingView>
        );
    }

    authenticate = () => {
        let formdata = new FormData();
            formdata.append('email', this.state.email);
            formdata.append('password', this.state.password);
        fetch('https://solucionesoggk.com/api/v1/user_authentication', {
            method: 'POST',
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            body: formdata,
            }).then((response) => response.json()).then((res => {
                if (res.success === true){
                    AsyncStorage.setItem('current_user', JSON.stringify(res.data));
                    if( res.data.idrol == '1'){
                        console.log("es admin");
                        this.props.navigation.navigate('AdminMap');
                    }
                    else if( res.data.idrol == '7' ){
                        console.log("is driver");
                        this.props.navigation.navigate('DriverHome');
                    }
                    else{
                        console.log("es usuario regular");
                        this.props.navigation.navigate('Home');
                    }
                    this.props.navigation.pop();
                }
                else{
                    alert(res.message);
                }
            }));
    };
};

const styles = StyleSheet.create({
    container: {
      flexGrow: 1,
      backgroundColor: 'white',
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
        color: 'white',
        fontSize: 20,
    },
    inputBox: {
        width: 300,
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
    buttonStyle: {
        margin: 20,
        backgroundColor: '#0277bd',
        width:300,
        paddingVertical: 10,
    }
  });

export default Login;