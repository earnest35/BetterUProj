import { StatusBar } from 'expo-status-bar';
import { TouchableOpacity,Button, Image,ScrollView,StyleSheet, Text, View } from 'react-native';
import { Header } from './Header';
import { useState } from 'react';
import { db } from './Firebase';
import { addDoc, collection, DocumentReference } from 'firebase/firestore';
import { workoutItems } from './WorkoutComponent';
    export function Workout(){
      const pairs = workoutItems.reduce((result, item, index) => {
        if (index % 2 === 0) {
          result.push([item]);
        } else {
          result[result.length - 1].push(item);
        }
        return result;
      }, []);
      const workoutCollection = collection(db,'workout');
      const [selectedWorkout,setSelectedWorkout] = useState([]);
      const viewSelectedWorkouts = () => {
        setSelectedWorkout(workouts => [...workouts, workout])
      }
      const handleAddWorkout = (workout) => {
        const alreadySelected = selectedWorkout.find((selected) => selected.id === workout.id);
        if (!alreadySelected) {
          setSelectedWorkout((prevSelectedWorkouts) => [...prevSelectedWorkouts, workout]);
          console.log(`Added ${workout.title} to selected workouts.`);
        } else {
          console.log(`${workout.title} is already selected.`);
        }

        addDoc(workoutCollection,workout)
    .then((docRef) =>{
      console.log(`Successfully posted ${workout.title} with ID:${docRef.id}`)
    })
    .catch((error) =>{
      console.log(`Error adding post ${error}`)
    })
  }
      return(
        <ScrollView style={{flex:1,backgroundColor:'lightgray'}}>
          <View style={{marginTop:30,marginBottom:30,borderRadius:5,overflow:'hidden'}}>
        <Text>Selected Workouts:</Text>
        <ScrollView horizontal={true} contentContainerStyle={{flexDirection:'row', marginBottom:15, borderRadius:5, overflow:'hidden', justifyContent:'center', alignItems:'center'}}>
        {selectedWorkout.map((workout,index) => (
          <Text key={index} style={{backgroundColor:'whitesmoke',color:'black',padding:8,marginHorizontal:5,fontSize:10,marginBottom: 5,fontSize:10}}>{workout.title}</Text>
        ))}
        </ScrollView>
      </View>
        {pairs.map((pair, index) => (
          <View key={index} style={workoutPageStyles.row}>
            <View style={workoutPageStyles.column}>
              <View style={workoutPageStyles.leftContent}>
                <Image source={pair[0].source} style={workoutPageStyles.image} />
                <Text style={workoutPageStyles.text}>{pair[0].title}</Text>
                <TouchableOpacity >
                    <Text style={workoutPageStyles.addNow} onPress={() => handleAddWorkout(pair[1])}>Add Now</Text>
                </TouchableOpacity>
              </View>
            </View>
            {pair[1] && (
              <View style={workoutPageStyles.column}>
                <View style={workoutPageStyles.rightContent}>
                  <Image source={pair[1].source} style={workoutPageStyles.image} />
                  <Text style={workoutPageStyles.text}>{pair[1].title}</Text>
                  <TouchableOpacity >
                    <Text style={workoutPageStyles.addNow} onPress={() => handleAddWorkout(pair[1])}>Add Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}
          </View>
        ))}
      </ScrollView>
      );
            }
      
      const workoutPageStyles = StyleSheet.create({
        row: {
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 35,
          justifyContent:'space-evenly',
          width:'100%',
          padding:5,
          position:'relative',
          marginHorizontal:10,
          height:200
        },
        text:{
          fontSize:12,
          position:'relative',
          bottom:'25%'
      
        },
        textCalories:{
        fontSize:10,
        position:'relative',
        top:'25%',
        right:'17%'
      
        },
        addNow:{
        position:'relative',
        left:'12%',
        top:'25%',
        backgroundColor:'lightblue',
        color:'white',
        padding:10,
        borderRadius:15
        },
        textAndButton:{
          justifyContent : 'center'
        },
        column: {
          flex: 1,
          alignItems: 'center',
          borderWidth: 1,
          borderColor: '#ccc',
          padding: 10,
          margin:10,
          width: '50%',
          height:'100%',
          backgroundColor:'white',
          position:'relative',
          left:'-5%',
          
      
        },
        leftContent: {
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          width:300,
          height:400
        },
        rightContent: {
          alignItems: 'center',
          justifyContent: 'center',
          flex: 1,
          width:300,
          height:400
        },
        image: {
          width: 170,
          height: 100,
          position:'relative',
          bottom:'25%',
      
      
        },
        button:{
          backgroundColor:'blue'
        }
      });
      