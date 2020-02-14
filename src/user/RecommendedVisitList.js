import React from 'react';
import { StyleSheet, Text, View, StatusBar,
    TextInput, TouchableOpacity,
    Image, ScrollView, KeyboardAvoidingView, Picker, FlatList, ListRenderItem, RefreshControl} from 'react-native';
    import { Header,Card, ListItem, List } from 'react-native-elements';
    import t from 'tcomb-form-native';
import AsyncStorage from '@react-native-community/async-storage';
import CustomMenuItem from '../CustomMenuItem';
import CustomDetailedItem from '../CustomDetailedItem';

var Form = t.form.Form;

class RecommendedVisitList extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            current_user: '',
            visit_list: null,
            refreshing: false,
        };
        this._getVisitList();
        
    }

    _onRefresh = () =>{
        this.setState({refreshing: true});
        this._getVisitList().then(() => {
          this.setState({refreshing: false});
        });
    }

    _showClientInMap = (item) => {
      this.props.navigation.navigate('TraceMap',{unique_client_data: item})
    }

    _getCurrentUser = async () =>{
        var current_user = await AsyncStorage.getItem('current_user');
        this.setState({current_user : JSON.parse(current_user)});
    }

    _getVisitList = async () =>{
        fetch('https://solucionesoggk.com/api/v1/clients_not_visited_since?days_ago=7', {
            method: 'GET',
            headers: {
                'Content-Type': 'multipart/form-data',
                'Cache-Control': 'no-cache'
            },
            }).then((response) => response.json()).then((res => {
                if (res.success === true){
                    this.setState({visit_list: res.data});                      
                }
                else{
                    alert(res.message);
                }
            }));
    }

    render(){
        return(
            <React.Fragment>
            <KeyboardAvoidingView style={styles.container_avoid_tab} behavior='padding'>
            <ScrollView  refreshControl={ <RefreshControl refreshing={this.state.refreshing} onRefresh={this._onRefresh.bind(this)} />  }> 
            <Card title="Visitados hace 7 días a más">
            {
                this.state.visit_list ?
                (
                    this.state.visit_list.map((item) => (
                        <ListItem
                            title={item.razon_social}
                            subtitle={"Fecha: " + item.last_visit + "| Hace " + item.days_ago + " días"}
                            key={item.idcliubic}
                            onPress={ () => this._showClientInMap(item) }
                            bottomDivider
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
export default RecommendedVisitList;