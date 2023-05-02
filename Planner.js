import { StatusBar } from 'expo-status-bar';
import { Button, Image,ScrollView,StyleSheet, Text, View } from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import { TouchableOpacity } from 'react-native';
import { Header } from './Header';
import { db } from './Firebase';
import { addDoc, collection, DocumentReference,query,getDocs,deleteDoc,doc,where,orderBy } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { useState } from 'react';
import { useEffect } from 'react';
import { Workout } from './Workout';
import { Food } from './Food';
import {Health } from './Health';
import { onAuthStateChanged } from 'firebase/auth';
import { PhotoProgression } from './PhotoProgression';
import { Calendar } from 'react-native-calendars';
import { FlatList } from 'react-native';
import { Ai } from './Ai';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import { auth } from './Firebase';

const Tab = createBottomTabNavigator();

export function MainTabs() {
  return (
    <Tab.Navigator>
      <Tab.Screen  name="Health"  component={Health}  options={{ headerShown: false, tabBarIcon: ({ focused, color, size }) => (
      <FontAwesome5 name="heartbeat" size={size} color={color} />), }}/>
      <Tab.Screen name="Planner" component={Planner} options={{headerShown: false,tabBarIcon: ({ focused, color, size }) => (
      <MaterialCommunityIcons name="calendar-blank" size={size} color={color} />), }}/>
      <Tab.Screen name="AI" component={Ai} options={{ headerShown: false,  tabBarIcon: ({ focused, color, size }) => (
      <FontAwesome name="android" size={size} color={color} /> ),  }} />
    </Tab.Navigator>
  );
}
export function Planner({navigation}){
  const [workoutTitles, setWorkoutTitles] = useState([]);
  const [foodTitles, setFoodTitles] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState('health');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [queriedItems, setQueriedItems] = useState([]);

  const [data, setData] = useState([]);
  const [userData, setUserData] = useState([]);

  const handleCollectionChange = (newCollection) => {
    setSelectedCollection(newCollection);
  };
  
  const handleDateChange = (event, selectedDate) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setSelectedDate(selectedDate);
      searchItemsByDate(selectedDate);
    }
  };
  
  // Add this function to show the date picker when needed
  const showDateTimePicker = () => {
    setShowDatePicker(true);
  };
  const searchItemsByDate = async (date) => {
    try {
      let collectionId;
      switch (selectedCollection) {
        case 'health':
          collectionId = 'healthData';
          break;
        case 'food':
          collectionId = 'userFoods';
          break;
        case 'workout':
          collectionId = 'userWorkouts';
          break;
        default:
          return;
      }
  
      const collectionRef = collection(db, collectionId);
      const q = query(
        collectionRef,
        where('userId', '==', auth.currentUser.uid),
        where('date', '>=', date),
        orderBy('date', 'asc')
      );
  
      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data(), collection: collectionId });
      });
  
      console.log(`Items found for collection ${collectionId}: `, items);
      setQueriedItems(items);
      return items;
    } catch (error) {
      console.error('Error searching items: ', error);
      alert('Error searching items');
    }
  };
  useEffect(() => {
    let isMounted = true;
  
    const fetchData = async () => {
      if (isMounted) {
        await searchItemsByDate(selectedDate);
      }
    };
  
    fetchData();
  
    return () => {
      isMounted = false;
    };
  }, [selectedCollection]);
  
  useEffect(() => {
    searchItemsByDate(selectedDate);
  }, [selectedCollection]);
 const WorkoutItems = ({ items }) => {
    return (
      <View style={[{marginTop:50},{position:'relative'},{zIndex:1}]}>
      <View>
        <Text style={{fontSize:20,textAlign:'center'}}>Workouts</Text>
      </View>
      <View style={{marginTop:10}}>
  {items.map((title, index) => 
    <View key={index} style={[plannerStyles.widgetPrompt, {marginBottom:10}]}>
        <Text style={{fontSize:20,textAlign:'center'}}>{title.title}</Text>
        {title.sets && title.reps && title.sets > 0 && <Text> - </Text>}
        <View style={{position:'relative',top:0,flexDirection: 'column',marginTop:5}}>
          {Array.from(Array(title.sets), (_, index) => 
            <Text style={{fontSize:17}}key={index}>Set {index + 1} of {title.reps} reps</Text>
          )}
        </View>
      
    </View>
  )}
</View>

    </View>
    );
  };
  const HealthItems = ({ items }) => {
    return (
      <View>
        <Text style={{ fontSize: 20, textAlign: 'center', marginTop: 50 }}>
          Health
        </Text>
        <View style={styles.userDataContainer}>
          {items.map((item,index) => (
            <View key={index} style={plannerStyles.widgetPrompt}>
              <Text>Stress Level: {item.stressLevel}</Text>
              <Text>Hydration Level: {item.hydrationLevel}</Text>
              <Text>Exercise Minutes: {item.exerciseMinutes}</Text>
              <Text>Sleep Hours: {item.sleepHours}</Text>
              <Text>Journal:{item.journalInput}</Text>
            </View>
          ))}
        </View>
      </View>
    );
  };
   const FoodItems = ({ items }) => {
    return (
      <View style={{marginTop:50}}>
      <Text style={{fontSize:20,textAlign:'center'}}>Meal</Text>
        <View style={[plannerStyles.widgetPromptDecor, plannerStyles.widgetPrompt, {backgroundColor:'#707070'}]}>
          
        <View style={{flexDirection:'row'}}>
          {items.map((title, index) => 
            <Text key={index} style={{fontSize:12, marginRight:5, backgroundColor:'white', padding:5}}>{title.title}</Text>
          )}
        </View>
        <View style={{marginTop:10}}>
          <Text style={{fontSize:12, fontWeight:'bold', color:'white'}}>Total Calories: {items.reduce((total, title) => total + title.calories, 0)}</Text>
        </View>
        </View>
      </View>
    );
  };
    return(
      <ScrollView style={{flex:1}}>
  <Header/>

  <View style={{ marginBottom: 20 }}>
  <View style={plannerStyles.widgetPrompt}>
    <Text style={plannerStyles.widgetPromptText}>Choose to add a meal or workout*</Text>
    <View style={{ position: 'relative', top: 152, flexDirection: 'row' }}>
      <TouchableOpacity
        onPress={() => navigation.navigate('Food')}
        style={[plannerStyles.widgetPromptButton, { backgroundColor: 'white', color: 'black' }]}
      >
        <Text style={{ textAlign: 'center' }}>Add Meal</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Workout')}
        style={[plannerStyles.widgetPromptButton, { backgroundColor: 'black', color: 'white' }]}
      >
        <Text style={{ color: "white", textAlign: 'center' }}>Add Workout</Text>
      </TouchableOpacity>
    </View>
  </View>
  <View style={plannerStyles.pickerContainer}>
    <Picker
      selectedValue={selectedCollection}
      onValueChange={(itemValue) => handleCollectionChange(itemValue)}
      style={plannerStyles.picker}
    >
      <Picker.Item label="Health" value="health" />
      <Picker.Item label="Food" value="food" />
      <Picker.Item label="Workout" value="workout" />
    </Picker>
    <TouchableOpacity onPress={showDateTimePicker} style={plannerStyles.datePickerButton}>
      <Text style={plannerStyles.datePickerButtonText}>Select Date</Text>
    </TouchableOpacity>
    {showDatePicker && (
      <DateTimePicker
        testID="dateTimePicker"
        value={selectedDate || new Date()}
        mode="date"
        display="default"
        onChange={handleDateChange}
      />
    )}
  </View>
</View>

  <View style={{marginTop: 100}}>
  {selectedCollection === 'health' && <HealthItems items={queriedItems} />}
{selectedCollection === 'food' && <FoodItems items={queriedItems} />}
{selectedCollection === 'workout' && <WorkoutItems items={queriedItems} />}

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
      marginBottom:30,
    },
    pickerContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      marginTop: 0,
      width: '75%',
      alignSelf: 'center',
      backgroundColor: '#D3D3D3',
      borderRadius: 5,
      padding: 5,
    },
    picker: {
      flex: 1,
      height: 10,
      marginBottom: 8,
    },
    datePickerButton: {
      backgroundColor: 'white',
      paddingHorizontal: 10,
      paddingVertical: 3,
      borderRadius: 5,
      marginLeft: 10,
      height: 30,
    },
      
  });
const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '100%',
    justifyContent: 'flex-end',
  },
  itemContainer: {
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderRadius: 5,
    marginBottom: 10,
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

  /*  useEffect(() => {
  const collectionRef = collection(db, 'userWorkouts');
  getDocs(collectionRef)
    .then(querySnapshot => {
      const data = querySnapshot.docs.map(doc => doc.data());
      setWorkoutTitles(data);
    })
    .catch(error => console.error('Error getting documents:', error));
}, []);
  useEffect(() => {
  const collectionRef = collection(db, 'userFoods');
  getDocs(collectionRef)
    .then(querySnapshot => {
      const data = querySnapshot.docs.map(doc => doc.data());
      setFoodTitles(data);
    })
    .catch(error => console.error('Error getting documents:', error));
}, []); 
console.log(workoutTitles);
  console.log(foodTitles) */