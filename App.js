import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { Button, Image,ScrollView,StyleSheet, Text, View } from 'react-native';
import { Workout } from './Workout';
import { Login } from './Login';
import { Food } from './Food';
import { Planner } from './Planner';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { registerRootComponent } from 'expo';
registerRootComponent(App);
const Stack = createNativeStackNavigator();
export default function App() {
  
  return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Login" component={Login}/>
          <Stack.Screen name="Planner" component={Planner} />
          <Stack.Screen name="Food" component={Food} />
          <Stack.Screen name="Workout" component={Workout} />
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
});



