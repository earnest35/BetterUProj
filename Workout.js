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
      const [selectedWorkouts,setSelectedWorkouts] = useState([]);
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
      return (
        <View style={{ flex: 1, backgroundColor: 'lightgray', paddingTop: 20 }}>
          <View style={workoutPageStyles.selectedWorkoutsContainer}>
      <Text style={workoutPageStyles.selectedWorkoutsTitle}>Selected Workouts:</Text>
      <ScrollView
        horizontal={true}
        contentContainerStyle={workoutPageStyles.selectedWorkoutsScroll}
      >
        {selectedWorkouts.map((workout, index) => (
          <Text
            key={index}
            style={workoutPageStyles.selectedWorkoutItem}
          >
            {workout.title}
          </Text>
        ))}
      </ScrollView>
    </View>
          <FlatList
            data={workoutItems}
            numColumns={2}
            keyExtractor={(item) => item.id.toString()}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            renderItem={({ item }) => (
              <View style={workoutPageStyles.card}>
                <View style={workoutPageStyles.cardContent}>
                  <Text style={workoutPageStyles.title}>{item.title}</Text>
                  <Image source={item.source} style={workoutPageStyles.image} />
                  <View style={workoutPageStyles.pickerContainer}>
                    <Picker
                      selectedValue={selectedSets[item.id]}
                      onValueChange={(itemValue, itemIndex) =>
                        setSelectedSets({ ...selectedSets, [item.id]: itemValue })
                      }
                      style={workoutPageStyles.picker}
                      itemStyle={{ fontSize: 12 }}
                      key={`${item.id}-sets-picker`}
                    >
                      {sets.map((set) => (
                        <Picker.Item key={set.value} label={set.label} value={set.value} />
                      ))}
                    </Picker>
                    <Picker
                      selectedValue={selectedReps[item.id]}
                      onValueChange={(itemValue, itemIndex) =>
                        setSelectedReps({ ...selectedReps, [item.id]: itemValue })
                      }
                      style={workoutPageStyles.picker}
                      itemStyle={{ fontSize: 12 }}
                      key={`${item.id}-reps-picker`}
                    >
                      {reps.map((rep) => (
                        <Picker.Item key={rep.value} label={rep.label} value={rep.value} />
                      ))}
                    </Picker>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleAddWorkout(item)}
                    style={workoutPageStyles.addButton}
                  >
                    <Text style={workoutPageStyles.addButtonText}>Add Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          />
        </View>
      );         }
      const workoutPageStyles = StyleSheet.create({
        card: {
          flex: 1,
          backgroundColor: '#fff',
          margin: 10,
          borderRadius: 10,
          overflow: 'hidden',
        },
        cardContent: {
          alignItems: 'center',
          padding: 10,
        },
        title: {
          fontSize: 18,
          fontWeight: 'bold',
          marginBottom: 10,
        },
        image: {
          width: 150,
          height: 150,
          resizeMode: 'cover',
        },
        pickerContainer: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          width: '100%',
          marginTop: 10,
          marginBottom: 15,
        },
        picker: {
          width: '48%',
          height: 30,
        },
        addButton: {
          backgroundColor: 'blue',
          paddingHorizontal: 20,
          paddingVertical: 5,
          borderRadius: 5,
        },
        addButtonText: {
          color: '#fff',
          fontSize: 16,
        },selectedWorkoutsContainer: {
          paddingHorizontal: 20,
          paddingBottom: 10,
        },
        selectedWorkoutsTitle: {
          fontSize: 16,
          fontWeight: 'bold',
          marginBottom: 5,
        },
        selectedWorkoutsScroll: {
          flexDirection: 'row',
          marginBottom: 15,
        },
        selectedWorkoutItem: {
          backgroundColor: 'whitesmoke',
          color: 'black',
          padding: 8,
          marginHorizontal: 5,
          fontSize: 10,
          borderRadius: 5,
        },
      });
      
         