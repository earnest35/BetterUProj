import { Camera } from 'expo-camera';
import { StatusBar } from 'expo-status-bar';
import { useState, useEffect } from 'react';//useEffect added
import { Button, Image,ScrollView,StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Header } from './Header';








export function PhotoProgression() {
    const [imageUri, setImageUri] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
    // Take photo using device camera
    const takePhoto = async () => {
      try {
        const { status } = await Permissions.askAsync(Permissions.CAMERA);
        if (status === 'granted') {
          const image = await ImagePicker.launchCameraAsync({
            allowsEditing: true,
            aspect: [4, 3],
          });
          if (!image.cancelled) {
            setImageUri(image.uri);
          }
        } else {
          throw new Error('Camera permission not granted');
        }
      } catch (err) {
        console.log(err.message);
        Alert.alert('Error', 'Failed to take photo. Please try again.');
      }
    };
  
    // Upload image to Firebase Storage and save metadata to Firestore
    const uploadImage = async () => {
      if (imageUri) {
        const response = await fetch(imageUri);
        const blob = await response.blob();
        const imageName = imageUri.split('/').pop();
        const ref = firebase.storage().ref().child(`images/${imageName}`);
        const snapshot = await ref.put(blob);
        const downloadUrl = await snapshot.ref.getDownloadURL();
        const timestamp = firebase.firestore.FieldValue.serverTimestamp();
        await firebase.firestore().collection('photos').add({
          downloadUrl,
          timestamp,
          date: selectedDate,
        });
        setImageUri(null);
      }
    };
  
    return (
      <View style={styles.container}>
        <Header/>
        <View style={styles.cameraContainer}>
          {imageUri && <Image source={{ uri: imageUri }} style={styles.previewImage} />}
          <Button title="Take Photo" onPress={takePhoto} />
          {imageUri && <Button title="Save Photo" onPress={uploadImage} />}
        </View>
        <View style={styles.calendarContainer}>
          <CalendarList
            current={selectedDate}
            onDayPress={(day) => setSelectedDate(day.dateString)}
          />
        </View>
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    cameraContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    previewImage: {
      width: 300,
      height: 300,
      marginBottom: 20,
    },
    calendarContainer: {
      flex: 1,
      marginTop: 20,
    },
  });