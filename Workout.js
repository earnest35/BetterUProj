import { StatusBar } from 'expo-status-bar';
import { FlatList } from 'react-native';
import { TouchableOpacity,Button, Image,ScrollView,StyleSheet, Text, View } from 'react-native';
import { Header } from './Header';
import { useState } from 'react';
import { db } from './Firebase';
import { addDoc, collection, DocumentReference } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import { workoutItems } from './WorkoutComponent';
import { Picker } from '@react-native-picker/picker';
import { auth } from './Firebase';
 const sets = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3},
  { label: '4', value: 4},
  { label: '5', value: 5},
];
 const reps = [
  { label: '1', value: 1 },
  { label: '2', value: 2 },
  { label: '3', value: 3},
  { label: '4', value: 4},
  { label: '5', value: 5},
  { label: '6', value: 6},
  { label: '7', value: 7},
  { label: '8', value: 8},
  { label: '9', value: 9},
  { label: '10', value: 10},
  { label: '11', value: 11},
  { label: '12', value: 12},
];

    export function Workout(){
      const [selectedWorkout,setSelectedWorkout] = useState([]);
      const [selectedSets, setSelectedSets] = useState(sets[0].value);
      const [selectedReps, setSelectedReps] = useState(reps[0].value);
      const userWorkoutCollection = collection(db, 'userWorkouts');
      const [userId, setUserId] = useState(null);
      /*const viewSelectedWorkouts = () => {
        setSelectedWorkout(workouts => [...workouts, workout])
      } */
      const handleAddWorkout = async (workout) => {
        if (!auth.currentUser) {
          alert('User not logged in. Please log in to add workout.');
          return;
        }
        const currentUser = auth.currentUser;
        const currentDate = new Date();
        const workoutWithDateAndUser = { ...workout, date: currentDate, userId: currentUser.uid };
      
        try {
          await addDoc(userWorkoutCollection, workoutWithDateAndUser);
          console.log(`Successfully posted ${workout.title}`);
          setSelectedWorkouts((prevSelectedWorkouts) => [...prevSelectedWorkouts, workout]);
          console.log(`Added ${workout.title} to selected workouts.`);
        } catch (error) {
          console.log(`Error adding workout: ${error}`);
        }
      };
      return(
        <View style={{ flex: 1, backgroundColor: 'lightgray' }}>
      <View style={{ marginTop: 30, marginBottom: 30, borderRadius: 5, overflow: 'hidden' }}>
      </View>
      <FlatList
  data={workoutItems}
  numColumns={2}
  keyExtractor={(item) => item.id.toString()}
  contentContainerStyle={{ minHeight: '100%' }}
  renderItem={({ item }) => (
    <View style={workoutPageStyles.column}>
      <View style={[workoutPageStyles.content, { height: 'auto' }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginRight: 10 }}>{item.title}</Text>
          <Picker
            selectedValue={selectedSets[item.id]}
            onValueChange={(itemValue, itemIndex) => setSelectedSets({ ...selectedSets, [item.id]: itemValue })}
            style={{ height: 30, width: 80 }}
            itemStyle={{ fontSize: 12 }}
            key={`${item.id}-sets-picker`}
          >
            {sets.map((set) => (
              <Picker.Item key={set.value} label={set.label} value={set.value} />
            ))}
          </Picker>
          <Picker
            selectedValue={selectedReps[item.id]}
            onValueChange={(itemValue, itemIndex) => setSelectedReps({ ...selectedReps, [item.id]: itemValue })}
            style={{ height: 30, width: 80 }}
            itemStyle={{ fontSize: 12 }}
            key={`${item.id}-reps-picker`}
          >
            {reps.map((rep) => (
              <Picker.Item key={rep.value} label={rep.label} value={rep.value} />
            ))}
          </Picker>
        </View>
        <Image source={item.source} style={workoutPageStyles.image} />
        <TouchableOpacity>
          <Text
            style={workoutPageStyles.addNow}
            onPress={() => handleAddWorkout(item)}>
            Add Now
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  )}
/>



    </View>
  );
};

      

const workoutPageStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  column: {
    flex: 1,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  content: {
    backgroundColor: '#fff',
    height:300,
    borderRadius: 5,
    overflow: 'hidden',
    alignItems: 'center',
    padding: 10,
  },
  image: {
    width: 150,
    height: 150,
    resizeMode: 'cover',
  },
  text: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 10,
    marginBottom: 5,
  },
  addNow: {
    backgroundColor: 'blue',
    color: '#fff',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: 'flex-end'
  },
});