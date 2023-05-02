import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  Button,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from 'react-native';
import Slider from '@react-native-community/slider';
import { TouchableWithoutFeedback } from 'react-native';
import { Header } from './Header';
import { db } from './Firebase';
import { getFirestore, collection, addDoc, query, where, getDocs, orderBy } from 'firebase/firestore';
import { auth } from './Firebase';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect } from 'react';

export const Health = () => {
  const [stressLevel, setStressLevel] = useState(5);
  const [hydrationLevel, setHydrationLevel] = useState(75);
  const [moodLevel, setMoodLevel] = useState(5);
  const [sleepHours, setSleepHours] = useState(8);
  const [exerciseMinutes, setExerciseMinutes] = useState(30);
  const [showDatePicker, setShowDatePicker] = useState(false);
const [selectedDate, setSelectedDate] = useState(new Date());
const [userData, setUserData] = useState([]);

useEffect(() => {
    searchItemsByDate(selectedDate);
  }, [selectedDate]);

  const handleStressChange = (value) => {
    setStressLevel(value);
  };

  const handleHydrationChange = (value) => {
    setHydrationLevel(value);
  };

  const handleMoodChange = (value) => {
    setMoodLevel(value);
  };

  const handleSleepChange = (value) => {
    setSleepHours(value);
  };

  const handleExerciseChange = (value) => {
    setExerciseMinutes(value);
  };

  const handleSavePress = async () => {
    // Save data to Firestore
    try {
      const healthData = {
        stressLevel,
        hydrationLevel,
        moodLevel,
        sleepHours,
        exerciseMinutes,
        date: new Date(),
        userId: auth.currentUser.uid,
      };
  
      await addDoc(collection(db, 'healthData'), healthData);
      alert('Data saved successfully');
    } catch (error) {
      console.error('Error saving data: ', error);
      alert('Error saving data');
    }
  };
  const handleDateChange = (event, selectedDate) => {
    if (selectedDate) {
      setSelectedDate(selectedDate);
    }
    setShowDatePicker(false);
  };
  const showDatepicker = () => {
    setShowDatePicker(true);
  };
  const searchItemsByDate = async (date) => {
    try {
      const healthDataRef = collection(db, 'healthData');
      const q = query(
        healthDataRef,
        where('userId', '==', auth.currentUser.uid),
        where('date', '>=', date),
        orderBy('date', 'asc')
      );
  
      const querySnapshot = await getDocs(q);
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push({ id: doc.id, ...doc.data() });
      });
  
      console.log('Items found: ', items);
      setUserData(items);
    } catch (error) {
      console.error('Error searching items: ', error);
      alert('Error searching items');
    }
  };
  
  return (
    <ScrollView style={styles.container}>
        <Header />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={{position:'absolute',top:100,left:0,right:0}}>
            <View style={styles.row}>
              <Text style={styles.label}>Stress Level:</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10}
                step={1}
                value={stressLevel}
                onValueChange={handleStressChange}
                minimumTrackTintColor="#000"
             maximumTrackTintColor="#000"
             thumbTintColor="#fff"
              />
              <Text style={styles.value}>{stressLevel}/10</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>Mood Level:</Text>
              <Slider
                style={styles.slider}
                minimumValue={0}
                maximumValue={10}
                step={1}
                value={moodLevel}
                onValueChange={handleMoodChange}
                minimumTrackTintColor="#000"
             maximumTrackTintColor="#000"
             thumbTintColor="#fff"
              />
              <Text style={styles.value}>{moodLevel}/10</Text>
            </View>
        <View style={styles.row}>
        <Text style={styles.label}>Sleep (hours):</Text>
        <Slider
             style={styles.slider}
             minimumValue={0}
             maximumValue={24}
             step={0.5}
             value={sleepHours}
             onValueChange={handleSleepChange}
             minimumTrackTintColor="#000"
             maximumTrackTintColor="#000"
             thumbTintColor="#fff"
           />
        <Text style={styles.value}>{sleepHours}</Text>
        </View>
        <View style={styles.row}>
        <Text style={styles.label}>Exercise (minutes):</Text>
        <Slider
             style={styles.slider}
             minimumValue={0}
             maximumValue={180}
             step={5}
             value={exerciseMinutes}
             onValueChange={handleExerciseChange}
             minimumTrackTintColor="#000"
             maximumTrackTintColor="#000"
             thumbTintColor="#fff"
           />
        <Text style={styles.value}>{exerciseMinutes}</Text>
        </View>
        <View style={styles.row}>
        <Text style={styles.label}>Journal:</Text>
        <TextInput
             style={styles.input}
             placeholder="Talk About Your Day..."
             multiline
             numberOfLines={4}
             textAlignVertical="top"
           />
        </View>
        <View style={styles.buttonContainer}>
        <Button
             title="Save"
             onPress={handleSavePress}
             color="black"
           />
        </View>
        </View>
        </TouchableWithoutFeedback>
        <View style={styles.datePickerContainer}>
  <Button title="Choose Date" onPress={showDatepicker} />
  {showDatePicker && (
    <DateTimePicker
      value={selectedDate}
      mode="date"
      display="default"
      onChange={handleDateChange}
    />
  )}
</View>
        </KeyboardAvoidingView>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
container: {
flex: 1,
padding: 20,
},
row: {
flexDirection: 'row',
alignItems: 'center',
marginVertical: 10,
},
label: {
fontSize: 18,
marginRight: 10,
},
slider: {
flex: 1,
marginHorizontal: 10,
},
value: {
fontSize: 18,
width: 50,
textAlign: 'center',
},
input: {
flex: 1,
borderWidth: 1,
borderColor: '#ccc',
borderRadius: 5,
paddingHorizontal: 10,
height: 100,
marginTop: 5,
},
buttonContainer: {
marginVertical: 20,
},
dateTimePickerWrapper: {
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});

export default Health;