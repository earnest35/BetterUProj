import { StatusBar } from 'expo-status-bar';
import { Button, Image,ScrollView,StyleSheet, Text, View } from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native';
import { Header } from './Header';
import { db } from './Firebase';
import { addDoc, collection, DocumentReference,query,getDocs,deleteDoc,doc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useState } from 'react';
import { useEffect } from 'react';
import { Workout } from './Workout';
import { Food } from './Food';
import { onAuthStateChanged } from 'firebase/auth';
import Goals from './Goals';
import { Picker } from 'react-native';
import { PhotoProgression } from './PhotoProgression';
const Tab = createBottomTabNavigator();
export function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="PhotoProgression" component={PhotoProgression} />
      <Tab.Screen name="Planner" component={Planner} />
      <Tab.Screen name="Goals" component={Goals} />
      
    </Tab.Navigator>
  );
}
export function Planner({navigation}){
  const [workoutTitles, setWorkoutTitles] = useState([]);
  const [foodTitles, setFoodTitles] = useState([]);
  const [userId, setUserId] = useState(null);

useEffect(() => {
  const collectionRef = collection(db, 'userWorkouts');
  getDocs(collectionRef)
    .then(querySnapshot => {
      const data = querySnapshot.docs.map(doc => doc.data().title);
      setWorkoutTitles(data);
    })
    .catch(error => console.error('Error getting documents:', error));
}, []);
useEffect(() => {
  const collectionRef = collection(db, 'userFoods');
  getDocs(collectionRef)
    .then(querySnapshot => {
      const data = querySnapshot.docs.map(doc => doc.data().title);
      setFoodTitles(data);
    })
    .catch(error => console.error('Error getting documents:', error));
}, []);
    return(
      <ScrollView style={{flex:1}}>
      <Header/>
      <View style={plannerStyles.widgetPrompt}>
        <Text style={plannerStyles.widgetPromptText}>Choose to add a meal or workout*</Text>
        <View style={{position:'relative',top:150,flexDirection:'row'}}>
        <TouchableOpacity
        onPress={() => navigation.navigate('Food')}
        style={[plannerStyles.widgetPromptButton,{backgroundColor:'white',color:'black'}]}
        >
          <Text style={{ textAlign: 'center',}}>Add Meal</Text>
        </TouchableOpacity>
        <TouchableOpacity
        onPress={() => navigation.navigate('Workout')}
        style={[plannerStyles.widgetPromptButton,{backgroundColor:'black',color:'white'}]}
        >
        <Text style={{  color:"white",textAlign: 'center' }}>Add Workout</Text>
        </TouchableOpacity>
        </View>
      <View style={{marginTop:200}}>
        <View style={{width:'100%',height:150,backgroundColor:'#707070',marginBottom:20,shadowColor:'black',
        shadow:15, overflow:'scroll',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,}}>
          <Text style={{fontSize:20}}>Lift</Text>
          <Text style={{fontSize:20}}>March 30</Text>
          <Text style={{fontSize:20}}>11:00AM-12:00PM</Text>
          <View style={{flexDirection:'row'}}>
            {workoutTitles.map((title, index) => 
            <Text key={index} style={{fontSize:8,alignContent:'center',justifyContent:'center',marginTop:10,marginRight:10,backgroundColor:'whitesmoke',padding:10}}>{title}</Text>
            )}
          </View>
        </View>
      <View style={{height:150,width:'100%',backgroundColor:'#707070',shadowColor:'black', overflow:'scroll',
        shadow:15,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,}}>
        <Text style={{fontSize:20}}>Meal</Text>
        <Text style={{fontSize:20}}>March 30</Text>
        <Text style={{fontSize:20}}>12:00PM-1:30PM</Text>
        <View style={{flexDirection:'row'}}>
      {foodTitles.map((title, index) => 
      <Text key={index} style={{fontSize:8,alignContent:'center',justifyContent:'center',marginTop:10,marginRight:10,backgroundColor:'whitesmoke',padding:10}}>{title}</Text>)}
      </View>
      </View>
    </View>
      </View>
    </ScrollView>
    )
}
const plannerStyles = StyleSheet.create({
    widgetPrompt:{
        width:"75%",
        height:187,
        backgroundColor:'#D3D3D3',
        marginHorizontal:50,
        marginTop:25,
        alignSelf:'center',
        borderRadius:5,
        shadowColor:'black',
        shadow:15,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 2,
        marginBottom:30
        
    },
    widgetPromptText:{
      textAlign:'center',
      position:'relative',
      top:75,
      color:'#909090'
    },
    widgetPromptButton:{
      width:'50%',
      borderRadius:5,
      height:20
    },
    button:{
        backgroundColor:'whitesmoke',
        color:'black',
    },
    selectedWorkout:{

    },
    selectedFood:{

    }
})
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
  },
});