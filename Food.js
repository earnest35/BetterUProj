import {Image,ScrollView, StyleSheet, Text, View } from 'react-native';
import { FlatList } from 'react-native';
import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useEffect } from 'react';
import 'firebase/auth';
import 'firebase/firestore';
import { db } from './Firebase';
import { addDoc, collection, DocumentReference } from 'firebase/firestore';
import { foodItems } from './FoodComponent';
import { Header } from './Header';
import { auth } from './Firebase';
export const Food = () => {
  const [selectedFood,setSelectedFood] = useState([]);
  const userFoodCollection = collection(db, 'userFoods');

  const handleAddFood = async (food) => {
    if (!auth.currentUser) {
      alert('User not logged in. Please log in to add workout.');
      return;
    }
  const currentUser = auth.currentUser;
  const currentDate = new Date();
  const foodWithDateAndUser = { ...food, date: currentDate, userId: currentUser.uid };

  try {
    await addDoc(userFoodCollection, foodWithDateAndUser);
    console.log(`Successfully posted ${food.title}`);
    setSelectedFood((prevSelectedFoods) => [...prevSelectedFoods, food]);
    console.log(`Added ${food.title} to selected foods.`);
  } catch (error) {
    console.log(`Error adding food: ${error}`);
  }
};
  return(
    <View style={{flex:1,backgroundColor:'lightgray'}}>
  <Header/>
  <View style={{marginTop:30,marginBottom:30,borderRadius:5,overflow:'hidden'}}>
    <Text>Selected Foods:</Text>
    <ScrollView horizontal={true} contentContainerStyle={{flexDirection:'row', marginBottom:15, borderRadius:5, overflow:'hidden', justifyContent:'center', alignItems:'center'}}>
    {selectedFood.map((food,index) => (
      <Text key={index} style={{backgroundColor:'whitesmoke',color:'black',padding:8,marginHorizontal:5,fontSize:10,marginBottom: 5,fontSize:10}}>{food.title}</Text>
    ))}
    </ScrollView>
  </View>
  <FlatList
    data={foodItems}
    numColumns={2}
    keyExtractor={(item) => item.id.toString()}
    contentContainerStyle = {{ minHeight:'100%'}}
    renderItem={({item}) => (
      <View style={foodPageStyles.column} >
        <View style={[foodPageStyles.content]}>
            <Image source={item.source} style={foodPageStyles.image} />
            <Text style={foodPageStyles.text}>{item.title}</Text>
            <Text style={[foodPageStyles.text,{position:'relative'},{right:'20%'},{bottom:'5%'}]}>{item.calories} calories</Text>
            <Text style={foodPageStyles.addNow}
            onPress={() => handleAddFood(item)}
            >ADD NOW</Text>
          </View>
      </View>
    )}
  />
</View>

  );
}
const foodPageStyles = StyleSheet.create({
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
    marginBottom: 2,
  },
  addNow: {
    backgroundColor: 'blue',
    color: '#fff',
    padding: 5,
    borderRadius: 5,
    marginTop: 5,
    alignSelf: 'flex-end',
    position:'relative',
    left:'10%',
    bottom:'10%'
  },
});