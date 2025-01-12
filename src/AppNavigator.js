import React, { useState, useEffect } from 'react';
import { Platform } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';
import { Appbar } from 'react-native-paper';
import LandingScreen from './Screens/Landing';
import HomeScreen from './Screens/Home';
import LoginScreen from './Screens/Auth/Login'; // Import Login Screen
import SignupScreen from './Screens/Auth/Signup'; // Import Login Screen
import TagDetailScreen from './Screens/TagDetail';
import NdefTypeListScreen from './Screens/NdefTypeList';
import NdefWriteScreen from './Screens/NdefWrite';
import ToolKitScreen from './Screens/Toolkit';
import TagKitScreen from './Screens/TagKit';
import CustomTransceiveScreen from './Screens/CustomTransceive';
import SettingsScreen from './Screens/Settings';
import SavedRecordScreen from './Screens/SavedRecord';
import NfcPromptAndroid from './Components/NfcPromptAndroid';
import Toast from './Components/Toast';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Theme from './Theme';
import OTPScreen from './Screens/Auth/OTPScreen';
import ForgotScreen from './Screens/Auth/ForgotScreen';
import { useAPI } from './Context/APIContext';

const RootStack = createStackNavigator();
const MainStack = createStackNavigator();
const HomeTabs = createBottomTabNavigator();

function HomeTabNav() {
  const {getUser, user}=useAPI();
  const isAdmin=getUser()?._j?.role==='admin';

  return (
    <HomeTabs.Navigator
      screenOptions={({ route }) => {
        const focusedName = getFocusedRouteNameFromRoute(route);
        const extraProps = {};
        if (focusedName !== undefined) {
          if (focusedName !== 'Home' && focusedName !== 'Assistant') {
            extraProps.tabBarStyle = { height: 0, display: 'none' };
          }
        }

        return {
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'HomeTab') {
              iconName = 'nfc-search-variant';
            } else if (route.name === 'NdefTypeListTab') {
              iconName = 'database-edit';
            } else if (route.name === 'ScanQR') {
              iconName = 'qrcode-scan';
            } else if (route.name === 'MyRecordsTab') {
              iconName = 'wifi';
            }
            else if (route.name === 'setting') {
              iconName = 'cogs';
            }
            

            return <Icon name={iconName} size={size} color={color} />;
          },
          headerShown: false,
          tabBarActiveTintColor: Theme.colors.blue,
          tabBarInactiveTintColor: 'black',
          ...extraProps,
        };
      }}
    >

      {
        isAdmin &&
        <HomeTabs.Screen
          name="HomeTab"
          component={HomeScreen}
          options={{ tabBarLabel: 'SCAN TAG' }}
        />
      }
      {/* <HomeTabs.Screen
        name="NdefTypeListTab"
        component={NdefTypeListScreen}
        options={{ title: 'WRITE NDEF' }}
      /> */}
      {
        !isAdmin &&
        <HomeTabs.Screen
          name="ScanQR"
          component={ToolKitScreen}
          options={{ title: 'ScanQR' }}
        />
      }
      <HomeTabs.Screen
        name="MyRecordsTab"
        component={SavedRecordScreen}
        options={{ title: 'TAGS' }}
      />
      <HomeTabs.Screen
        name="setting"
        component={SettingsScreen}
        options={{ title: 'Setting' }}
      />
    </HomeTabs.Navigator>
  );
}

function Main(props) {
  return (
    <MainStack.Navigator
      screenOptions={{
        header: (headerProps) => {
          const { navigation, back, options, route } = headerProps;
          const excludedScreens = ['Home', 'NdefWrite', 'CustomTransceive'];

          if (excludedScreens.findIndex((name) => name === route?.name) > -1) {
            return null;
          }

          return (
            <Appbar.Header style={{ backgroundColor: 'white' }}>
              {back && (
                <Appbar.BackAction onPress={() => navigation.goBack()} />
              )}
              <Appbar.Content title={options?.title || ''} />
            </Appbar.Header>
          );
        },
      }}
    >
      <MainStack.Screen
        name="TagDetail"
        options={{ title: 'TAG DETAIL' }}
        component={TagDetailScreen}
      />
      <MainStack.Screen
        name="NdefWrite"
        component={NdefWriteScreen}
        options={{ title: 'WRITE NDEF' }}
      />
      <MainStack.Screen
        name="CustomTransceive"
        component={CustomTransceiveScreen}
        options={{ title: 'CUSTOM TRANSCEIVE' }}
      />
      <MainStack.Screen
        name="SavedRecord"
        component={SavedRecordScreen}
        options={{ title: 'MY SAVED RECORDS' }}
      />
    </MainStack.Navigator>
  );
}

function Root(props) {
  const {getUser, user}=useAPI();
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Temporary login state

  useEffect(() => {
    // Simulate login logic or fetch login status from storage
    const checkLoginStatus = async () => {
      const status = getUser()?._j;
      console.log("Status is :", status);
      
      setIsLoggedIn(status);
    };
    checkLoginStatus();
  }, [getUser,user]);

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
        presentation: 'modal',
        cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
      }}
    >
      {!isLoggedIn ? (
        <>
          <RootStack.Screen name="Login" component={LoginScreen}
            
           />
          <RootStack.Screen
            name="Signup"
            component={SignupScreen} 
          />
          <RootStack.Screen
            name="OTPScreen"
            component={OTPScreen} 
          />
          <RootStack.Screen
            name="ForgotScreen"
            component={ForgotScreen} 
          />
        </>
      ) : (
        <>
          <RootStack.Screen name="Landing" component={LandingScreen} />
          <RootStack.Screen name="Settings" component={SettingsScreen}  />
          <RootStack.Screen name="Main" component={Main} />
          <RootStack.Screen
            name="MainTabs"
            component={HomeTabNav}
            options={{ animationEnabled: false }}
          />
        </>
      )}
    </RootStack.Navigator>
  );
}

function AppNavigator(props) {
  return (
    <NavigationContainer>
      <Root />
      <NfcPromptAndroid />
      <Toast />
    </NavigationContainer>
  );
}

export default AppNavigator;
