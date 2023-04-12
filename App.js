import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, Image,ScrollView,StyleSheet, Text, View } from 'react-native';
import { Workout } from './Workout';
import { Login } from './Login';
import { Food } from './Food';
import { Planner } from './Planner';
import { PhotoProgression } from './PhotoProgression';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { registerRootComponent } from 'expo';
registerRootComponent(App);
const Stack = createNativeStackNavigator();
export default function App() {
  
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="PhotoProgression" component={PhotoProgression} />
        </Stack.Navigator>
      </NavigationContainer>
  );  /*
  return(
    <View style={styles.container}>
    <Workout/>
    {/*<Login/> }
     
    </View>
  )
  */
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },



  // I added 7:17 4_7_2023(Ken)
  "android": {
    "permissions": [
      "CAMERA",
      "READ_EXTERNAL_STORAGE",
      "WRITE_EXTERNAL_STORAGE"
    ]
  },
  "ios": {
    "infoPlist": {
      "NSCameraUsageDescription": "This app needs access to your camera",
      "NSPhotoLibraryUsageDescription": "This app needs access to your photo library"
    }
  }



});



