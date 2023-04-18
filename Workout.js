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
import { sets } from './WorkoutComponent';
import { reps } from './WorkoutComponent';
    export function Workout(){
      const [selectedWorkout,setSelectedWorkout] = useState([]);
      const userWorkoutCollection = collection(db, 'userWorkouts');
      const [userId, setUserId] = useState(null);
      useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user) {
            setUserId(user.uid);
          } else {
            setUserId(null);
          }
        });
        return unsubscribe;
      }, []);
      const foodRef = userId ? collection(userWorkoutCollection, userId, 'workouts') : null;
      const viewSelectedWorkouts = () => {
        setSelectedWorkout(workouts => [...workouts, workout])
      }
      const handleAddWorkout = (workout) => {
        const alreadySelected = selectedWorkout.find((selected) => selected.id === workout.id);
        if (!alreadySelected) {
          addDoc(userWorkoutCollection,workout)
          .then((docRef) =>{
            console.log(`Successfully posted ${workout.title} with ID:${docRef.id}`)
           })
          .catch((error) =>{
            console.log(`Error adding workout ${error}`)
          })
          setSelectedWorkout((prevSelectedWorkouts) => [...prevSelectedWorkouts, workout]);
          console.log(`Added ${workout.title} to selected workouts.`);
        } else {
          console.log(`${workout.title} is already selected.`);
        }
  }
      return(
        <View style={{ flex: 1, backgroundColor: 'lightgray' }}>
      <View style={{ marginTop: 30, marginBottom: 30, borderRadius: 5, overflow: 'hidden' }}>
        <Text>Selected Workouts:</Text>
        <ScrollView
          horizontal={true}
          contentContainerStyle={{
            flexDirection: 'row',
            marginBottom: 15,
            borderRadius: 5,
            overflow: 'hidden',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          {selectedWorkout.map((workout, index) => (
            <Text
              key={index}
              style={{
                backgroundColor: 'whitesmoke',
                color: 'black',
                padding: 8,
                marginHorizontal: 5,
                fontSize: 10,
                marginBottom: 5,
                fontSize: 10,
                marginBottom: 5,
                fontSize: 10,
              }}>
              {workout.title}
            </Text>
          ))}
        </ScrollView>
      </View>
      <FlatList
        data={workoutItems}
        numColumns={2}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ minHeight: '100%' }}
        renderItem={({ item }) => (
          <View style={workoutPageStyles.column}>
            <View style={workoutPageStyles.content}>
              <Image source={item.source} style={workoutPageStyles.image} />
              <Text style={workoutPageStyles.text}>{item.title}</Text>
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
    height:250,
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