import React, {Component} from 'react';
import { StyleSheet,View, Text } from 'react-native';

import {  createDrawerNavigator, createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack';
import { Icon } from 'react-native-elements';

import Login from './Login';
import Home from './user/Home';
import AuthLoading from './AuthLoading';
import Profile from './user/Profile';
import AdminHome from './admin/Home';
import AdminMap from './admin/AdminMap';
import DriverHome from './driver/Home';
import PendingList from './driver/PendingList';
import DeliveredList from './driver/DeliveredList';
import TraceMapImproved from './driver/TraceMapImproved';
import ClientForm from './user/ClientForm';
import ClientList from './user/ClientList';
import ClientListNoRuc from './user/ClientListNoRuc';
import RecommendedVisitList from './user/RecommendedVisitList';
import SearchPage from './user/SearchPage';
import SucursalForm from './user/SucursalForm';
import VisitFormImproved from './user/VisitFormImproved';
import VisitList from './user/VisitList';
import TraceMap from './user/TraceMap';
import MyMap from './user/MyMap';
import OrdersList from './user/OrdersList';
import ProductsForm from './user/ProductsForm';
import OrderForm from './user/OrderForm';
import CollectorHome from './collector/Home';
import PendingBills from './collector/PendingBills';
import PaymentForm from './collector/PaymentForm';
import ClientHome from './client/Home';
import ClientProfile from './client/Profile';
import ClientProductsForm from './client/ClientProductsForm';
import ClientOrderForm from './client/ClientOrderForm';


const styles = StyleSheet.create({  
  header: {
    backgroundColor: '#517fa4',
  },
  header_text: {
    color:'white',
    textAlign: 'center',
    fontSize: 14,
  }
});


const AdminStack = createBottomTabNavigator({
  AdminHome: {
    screen: AdminHome,
    navigationOptions: {
      tabBarLabel:"Inicio",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="home" size={30} color="#0277bd" />
      )
    },
  },
  AdminMap: {
    screen: AdminMap,
    navigationOptions: {
      tabBarLabel:"Mapa",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="home" size={30} color="#0277bd" />
      )
    },
  },
  AdminProfile:{
    screen: Profile,
    navigationOptions: {
      tabBarLabel:"Perfil",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="person" size={30} color="#0277bd" />
      )
    },
  },
})



const ManagementStack = createStackNavigator({
    ManagementHome: {
      screen: Home,
      navigationOptions: {
        title: 'Registro y búsqueda de clientes',
        headerBackTitle: 'Atrás',      
      },
    },
    ClientWithRuc: {
      screen: ClientList,
      navigationOptions: {
        title: 'Ver/Agregar clientes',
        headerBackTitle: 'Atrás',
      },
    },
    CreateNewClient: {
      screen: ClientForm,
      navigationOptions: {
        title: 'Agregar un nuevo cliente',
        headerBackTitle: 'Atrás',

      },
    },
    CreateNewSucursal: {
      screen: SucursalForm,
      navigationOptions: {
        title: 'Agregar una nueva sucursal',
        headerBackTitle: 'Atrás',

      },
    },
    ClientNoRuc: {
      screen: ClientListNoRuc,
      navigationOptions: {
        title: 'Ver/Editar clientes sin ruc',
        headerBackTitle: 'Atrás',
      },
    },
    VisitList: {
      screen: VisitList,
      navigationOptions: {
        title: 'Agregar una visita/ver visitas para hoy',
        headerBackTitle: 'Atrás',
      },
    },
    AddNewVisit: {
      screen: VisitFormImproved,
      navigationOptions: {
        title: 'Agregar una visita',
        headerBackTitle: 'Atrás',
      },
    },
    SearchPage: {
      screen: SearchPage,
      navigationOptions: {
        title: 'Búsqueda de clientes',
        headerBackTitle: 'Atrás',
      },
    },
    RecommendedVisitList: {
      screen: RecommendedVisitList,
      navigationOptions: {
        title: 'Clientes visitados hace más de una semana',
        headerBackTitle: 'Atrás',
      },
    },
    TraceMap: {
      screen: TraceMap,
      navigationOptions: {
        title: 'Localizar Cliente',
        headerBackTitle: 'Atrás',
      },
    }, 
    OrdersList: {
      screen: OrdersList,
      navigationOptions: {
        title: 'Lista de órdenes de venta',
        headerBackTitle: 'Atrás',
      },
    },
    ProductsForm: {
      screen: ProductsForm,
      navigationOptions: {
        title: 'Agregar Productos',
        headerBackTitle: 'Atrás',
      },
    },
    OrderForm: {
      screen: OrderForm,
      navigationOptions: {
        title: 'Confirmar Orden de Venta',
        headerBackTitle: 'Atrás',
      },
    },
  },

  {
    initialRouteName: 'ManagementHome',
    defaultNavigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.header_text,
      headerTintColor:'white',
    },
  });



const DriverManagement = createStackNavigator({
    DriverHome: {
      screen: DriverHome,
      navigationOptions: {
        title: 'Módulo de Entregas',
        headerBackTitle: 'Atrás',      
      },
    },
    SearchPage: {
      screen: SearchPage,
      navigationOptions: {
        title: 'Búsqueda de clientes',
        headerBackTitle: 'Atrás',
      },
    },
    PendingList: {
      screen: PendingList,
      navigationOptions: {
        title: 'Lista de entregas pendientes',
        headerBackTitle: 'Atrás',
      },
    },
    DeliveredList: {
      screen: DeliveredList,
      navigationOptions: {
        title: 'Lista de entregas realizadas',
        headerBackTitle: 'Atrás',
      },
    },
    TraceMapImproved: {
      screen: TraceMapImproved,
      navigationOptions: {
        title: 'Ubicación(es) de cliente(s)',
        headerBackTitle: 'Atrás',
      },
    },
    PendingBills:{
      screen: PendingBills,
      navigationOptions: {
        title: 'Lista de facturas pendientes',
        headerBackTitle: 'Atrás',
      },
    },
    PaymentForm:{
      screen: PaymentForm,
      navigationOptions: {
        title: 'Agregar pago',
        headerBackTitle: 'Atrás',
      },
    },
    VisitList: {
      screen: VisitList,
      navigationOptions: {
        title: 'Agregar una visita/ver visitas para hoy',
        headerBackTitle: 'Atrás',
      },
    },
    AddNewVisit: {
      screen: VisitFormImproved,
      navigationOptions: {
        title: 'Agregar una visita',
        headerBackTitle: 'Atrás',
      },
    },
    TraceMap: {
      screen: TraceMap,
      navigationOptions: {
        title: 'Localizar Cliente',
        headerBackTitle: 'Atrás',
      },
    } 
  },

  {
    initialRouteName: 'DriverHome',
    defaultNavigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.header_text,
      headerTintColor:'white',
    },
  });

const DriverStack = createBottomTabNavigator({
  DriverHome: {
    screen: DriverManagement,
    navigationOptions: {
      tabBarLabel:"Inicio",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="home" size={30} color="#0277bd" />
      )
    },
  },
  DriverProfile:{
    screen: Profile,
    navigationOptions: {
      tabBarLabel:"Perfil",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="person" size={30} color="#0277bd" />
      )
    },
  },
})

const ClientManagement = createStackNavigator({
    ClientHome: {
      screen: ClientHome,
      navigationOptions: {
        title: 'Módulo de Entregas',
        headerBackTitle: 'Atrás',      
      },
    },
    ClientProductsForm: {
      screen: ClientProductsForm,
      navigationOptions: {
        title: 'Agregar Productos',
        headerBackTitle: 'Atrás',
      },
    },
    ClientOrderForm: {
      screen: ClientOrderForm,
      navigationOptions: {
        title: 'Confirmar Orden de Venta',
        headerBackTitle: 'Atrás',
      },
    },
  },

  {
    initialRouteName: 'ClientHome',
    defaultNavigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.header_text,
      headerTintColor:'white',
    },
  });

const ClientStack = createBottomTabNavigator({
  ClientHome: {
    screen: ClientManagement,
    navigationOptions: {
      tabBarLabel:"Inicio",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="home" size={30} color="#0277bd" />
      )
    },
  },
  ClientProfile:{
    screen: ClientProfile,
    navigationOptions: {
      tabBarLabel:"Perfil",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="person" size={30} color="#0277bd" />
      )
    },
  },
})

const CollectorManagement = createStackNavigator({
    CollectorHome: {
      screen: CollectorHome,
      navigationOptions: {
        title: 'Módulo de Cobranzas',
        headerBackTitle: 'Atrás',      
      },
    },
    SearchPage: {
      screen: SearchPage,
      navigationOptions: {
        title: 'Búsqueda de clientes',
        headerBackTitle: 'Atrás',
      },
    },
    PendingBills:{
      screen: PendingBills,
      navigationOptions: {
        title: 'Lista de facturas pendientes',
        headerBackTitle: 'Atrás',
      },
    },
    PaymentForm:{
      screen: PaymentForm,
      navigationOptions: {
        title: 'Agregar pago',
        headerBackTitle: 'Atrás',
      },
    },
    VisitList: {
      screen: VisitList,
      navigationOptions: {
        title: 'Agregar una visita/ver visitas para hoy',
        headerBackTitle: 'Atrás',
      },
    },
    AddNewVisit: {
      screen: VisitFormImproved,
      navigationOptions: {
        title: 'Agregar una visita',
        headerBackTitle: 'Atrás',
      },
    },
    TraceMapImproved: {
      screen: TraceMapImproved,
      navigationOptions: {
        title: 'Ubicación(es) de cliente(s)',
        headerBackTitle: 'Atrás',
      },
    },
    TraceMap: {
      screen: TraceMap,
      navigationOptions: {
        title: 'Localizar Cliente',
        headerBackTitle: 'Atrás',
      },
    } 
  },

  {
    initialRouteName: 'CollectorHome',
    defaultNavigationOptions: {
      headerStyle: styles.header,
      headerTitleStyle: styles.header_text,
      headerTintColor:'white',
    },
  });

const CollectorStack = createBottomTabNavigator({
  CollectorHome: {
    screen: CollectorManagement,
    navigationOptions: {
      tabBarLabel:"Inicio",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="home" size={30} color="#0277bd" />
      )
    },
  },
  CollectorProfile:{
    screen: Profile,
    navigationOptions: {
      tabBarLabel:"Perfil",
      tabBarIcon: ({ tintColor }) => (
        <Icon name="person" size={30} color="#0277bd" />
      )
    },
  },
})


const AppStack = createBottomTabNavigator({
    Home: {
      screen: ManagementStack,
      navigationOptions: {
        tabBarLabel:"Clientes",
        tabBarIcon: ({ tintColor }) => (
          <Icon name="home" size={30} color="#0277bd" />
        )
      },
    },
    Map: {
        screen: MyMap,
        navigationOptions: {
          tabBarLabel:"Mapa",
          tabBarIcon: ({ tintColor }) => (
            <Icon name="explore" size={30} color="#0277bd" />
          )
        },
        
    },
    Profile:{
      screen: Profile,
      navigationOptions: {
        tabBarLabel:"Perfil",
        tabBarIcon: ({ tintColor }) => (
          <Icon name="person" size={30} color="#0277bd" />
        )
      },
    },
      
  },
  {
    defaultNavigationOptions:{  
      tabBarOptions:{
        swipeEnabled: true,
        drawBehind: false,
      }
    }
  }
  );
  
  const AuthStack = createStackNavigator({
    Login: {
      screen: Login,
      navigationOptions: {
        header: null,
      },
    }
  },  {
    initialRouteName: 'Login',
  });


const AppNavigation = createAppContainer(createSwitchNavigator({
    AuthLoading: AuthLoading,
    App: AppStack,
    Auth: AuthStack,
    Admin: AdminStack,
    Driver: DriverStack,
    Collector: CollectorStack,
    Client: ClientStack,
  },
)
);

export default AppNavigation;

