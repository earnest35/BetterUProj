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
import { Picker } from 'react-native';
import { PhotoProgression } from './PhotoProgression';
import { Calendar } from 'react-native-calendars';
import { FlatList } from 'react-native';
import { Ai } from './Ai';
const Tab = createBottomTabNavigator();
export function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="PhotoProgression" component={PhotoProgression} options={{ headerShown: false }} />
      <Tab.Screen name="Planner" component={Planner} options={{ headerShown: false }} />
      <Tab.Screen name="AI" component={Ai} options={{ headerShown: false }} />
      
    </Tab.Navigator>
  );
}
export function Planner({navigation}){
  const [workoutTitles, setWorkoutTitles] = useState([]);
  const [foodTitles, setFoodTitles] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [data, setData] = useState([]);
  useEffect(() => {
    setData([
      { key: 'lift', title: 'Lift', subTitle: selectedDate, items: workoutTitles },
      { key: 'meal', title: 'Meal', subTitle: selectedDate, items: foodTitles }
    ]);
  }, [selectedDate, workoutTitles, foodTitles]);
  useEffect(() => {
  const collectionRef = collection(db, 'userWorkouts');
  getDocs(collectionRef)
    .then(querySnapshot => {
      const data = querySnapshot.docs.map(doc => doc.data().title);
      setWorkoutTitles(data);
    })
    .catch(error => console.error('Error getting documents:', error));
}, []);
const handleDayPress = (day) => {
  setSelectedDate(day)
};
  useEffect(() => {
  const collectionRef = collection(db, 'userFoods');
  getDocs(collectionRef)
    .then(querySnapshot => {
      const data = querySnapshot.docs.map(doc => doc.data().title);
      setFoodTitles(data);
    })
    .catch(error => console.error('Error getting documents:', error));
}, []);
console.log(workoutTitles);
  console.log(foodTitles)
    return(
      <ScrollView style={{flex:1}}>
  <Header/>

  <View style={{marginBottom: 20}}> 
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
    </View>
  </View>

  <View style={{marginBottom: 20}}>
    <View style={[{marginTop:50},{position:'relative'},{zIndex:1}]}>
      <View>
        <Text style={{fontSize:20,textAlign:'center'}}>Workouts</Text>
      </View>
      <View style={{marginTop:10}}>
        {workoutTitles.map((title, index) => 
          <View key={index} style={[plannerStyles.widgetPrompt, {marginBottom:10}]}>
            <Text style={{fontSize:15,alignContent:'center',textAlign:'center',justifyContent:'center',padding:10}}>{title}</Text>
          </View>
        )}
      </View>
    </View>

    <View style={[plannerStyles.widgetPromptDecor,plannerStyles.widgetPrompt,{backgroundColor:'#707070'},{marginTop:20},{position:'relative'},{zIndex:1}]}>
      <Text style={{fontSize:20}}>Meal</Text>
      <Text style={{fontSize:20}}>March 30</Text>
      <Text style={{fontSize:20}}>12:00PM-1:30PM</Text>
      <View style={{flexDirection:'column'}}>
        {foodTitles.map((title, index) => 
          <View key={index} style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={{width: 10, height: 10, borderRadius: 5, backgroundColor: 'black', marginRight: 5}}></View>
            <Text style={{fontSize:16,marginRight:10}}>{title}</Text>
          </View>
        )}
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
    widgetPromptDecor:{
      width:'100%',
      height:150,
      backgroundColor:'#707070',
      marginBottom:20,
      shadowColor:'black',
      shadow:15, overflow:'scroll',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 2
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

    },
    workoutDisplay:{
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
const calendarStyles = StyleSheet.create({
  main:{
    height: "65%",
    width: "90%",
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: 'white',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 2,
    
  },
  theme:{
    selectedDayBackgroundColor: 'blue',
    todayTextColor: 'blue',
    arrowColor: 'black',
  }
})
/* <Calendar
   onDayPress={(day) => setSelectedDate(day.dateString)}
   markedDates={{
     [selectedDate]: { selected: true }
   }}
    style={calendarStyles.main}
    theme={calendarStyles.theme}
  />*/
  //I'll figure it out someday just not rn
  